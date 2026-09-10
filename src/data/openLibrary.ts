import { Book, BookSynopsis } from "./types";
import { createHash } from "crypto";
import { mkdir, readdir, stat, writeFile } from "fs/promises";
import path from "path";
import {
  GoogleBooksVolume,
  bookSearchTitle,
  matchesBookTitleAndAuthor,
  normalizeIsbn,
  readBookSynopsis,
  selectGoogleBooksVolume,
  synopsisFromGoogleVolume,
  synopsisFromDescription,
  writeBookSynopsis,
} from "./bookSynopsis";

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
};

type OpenLibraryResponse = {
  docs?: OpenLibraryDoc[];
};

type OpenLibraryBookResponse = Record<
  string,
  {
    url?: string;
    title?: string;
    authors?: Array<{ name?: string }>;
    cover?: {
      large?: string;
      medium?: string;
      small?: string;
    };
  }
>;

type GoogleBooksResponse = {
  items?: GoogleBooksVolume[];
};

type OpenLibraryEditionOrWork = {
  key?: string;
  description?: string | { value?: string };
  works?: Array<{ key?: string }>;
  languages?: Array<{ key?: string }>;
};

const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";
const OPEN_LIBRARY_BOOKS_URL = "https://openlibrary.org/api/books";
const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
const LOCAL_COVER_DIR = path.join(
  process.cwd(),
  "public",
  "img",
  "book-covers",
);
const LOCAL_COVER_PREFIX = "/img/book-covers";
const LOCAL_COVER_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
];
const SHOULD_WRITE_COVERS = process.env.BOOK_COVER_WRITE === "1";
const SHOULD_WRITE_SYNOPSES = process.env.BOOK_SYNOPSIS_WRITE === "1";
const SHOULD_REMOTE_ENRICH = process.env.BOOK_REMOTE_ENRICHMENT !== "0";
let localCoverFilesPromise: Promise<string[]> | undefined;
let googleBooksQuotaExhausted = false;

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildCoverUrl(coverId: number) {
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
}

function normalizeGoogleCoverUrl(url?: string) {
  if (!url) {
    return undefined;
  }
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
}

function getBookCoverKey(book: Book) {
  const isbn = normalizeIsbn(book.isbn13 ?? book.isbn);
  if (isbn) {
    return `isbn-${isbn.toLowerCase()}`;
  }

  if (book.asin) {
    return `asin-${book.asin.replace(/[^0-9A-Za-z]/g, "").toLowerCase()}`;
  }

  return `title-${toSlug(book.title)}`;
}

function getCoverExtensionFromUrl(url: string) {
  try {
    const pathname = new URL(url).pathname;
    const extension = path.extname(pathname).toLowerCase();
    if (LOCAL_COVER_EXTENSIONS.includes(extension)) {
      return extension;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function getCoverExtensionFromContentType(contentType?: string) {
  if (!contentType) {
    return undefined;
  }

  const value = contentType.toLowerCase();
  if (value.includes("image/jpeg") || value.includes("image/jpg")) {
    return ".jpg";
  }
  if (value.includes("image/png")) {
    return ".png";
  }
  if (value.includes("image/webp")) {
    return ".webp";
  }
  if (value.includes("image/gif")) {
    return ".gif";
  }
  if (value.includes("image/avif")) {
    return ".avif";
  }
  return undefined;
}

async function fileExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getExistingCoverFilePath(stem: string) {
  for (const extension of LOCAL_COVER_EXTENSIONS) {
    const candidate = path.join(LOCAL_COVER_DIR, `${stem}${extension}`);
    if (await fileExists(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

async function getLocalCoverFiles() {
  localCoverFilesPromise ??= readdir(LOCAL_COVER_DIR).catch(() => []);
  return localCoverFilesPromise;
}

async function getExistingCoverFilePathByKey(key: string) {
  const files = await getLocalCoverFiles();
  const filename = files
    .filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return (
        file.startsWith(`${key}-`) &&
        LOCAL_COVER_EXTENSIONS.includes(extension)
      );
    })
    .sort()[0];

  return filename ? path.join(LOCAL_COVER_DIR, filename) : undefined;
}

function getPublicCoverPath(filePath: string) {
  return `${LOCAL_COVER_PREFIX}/${path.basename(filePath)}`;
}

async function getLocalCoverImage(book: Book) {
  if (book.image) {
    return book.image;
  }

  const coverPath = await getExistingCoverFilePathByKey(getBookCoverKey(book));
  return coverPath ? getPublicCoverPath(coverPath) : undefined;
}

async function persistCoverImageLocally(book: Book, imageUrl?: string) {
  if (!imageUrl || !SHOULD_WRITE_COVERS) {
    return imageUrl;
  }

  if (imageUrl.startsWith(LOCAL_COVER_PREFIX)) {
    return imageUrl;
  }

  if (!/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  try {
    const key = getBookCoverKey(book);
    const imageHash = createHash("sha1").update(imageUrl).digest("hex").slice(0, 12);
    const stem = `${key}-${imageHash}`;

    const existingPath = await getExistingCoverFilePath(stem);
    if (existingPath) {
      return getPublicCoverPath(existingPath);
    }

    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent": "osbornm.github.io-books/1.0",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      return imageUrl;
    }

    const contentType = response.headers.get("content-type") ?? undefined;
    if (contentType && !contentType.toLowerCase().startsWith("image/")) {
      return imageUrl;
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length) {
      return imageUrl;
    }

    const extension =
      getCoverExtensionFromContentType(contentType) ??
      getCoverExtensionFromUrl(imageUrl) ??
      ".jpg";

    await mkdir(LOCAL_COVER_DIR, { recursive: true });

    const targetPath = path.join(LOCAL_COVER_DIR, `${stem}${extension}`);
    await writeFile(targetPath, bytes);

    return getPublicCoverPath(targetPath);
  } catch {
    return imageUrl;
  }
}

async function searchOpenLibrary(query: string, value: string) {
  const url = `${OPEN_LIBRARY_SEARCH_URL}?${query}=${encodeURIComponent(value)}&limit=1&fields=key,title,author_name,cover_i`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: {
      "User-Agent": "osbornm.github.io-books/1.0",
    },
    cache: "force-cache",
  });

  if (!response.ok) {
    return undefined;
  }

  const data = (await response.json()) as OpenLibraryResponse;
  return data.docs?.[0];
}

async function fetchGoogleBooks(book: Book): Promise<{ image?: string; synopsis?: BookSynopsis; author?: string } | undefined> {
  if (googleBooksQuotaExhausted) return undefined;
  const isbn = normalizeIsbn(book.isbn13 ?? book.isbn);
  const query = isbn
    ? `isbn:${isbn}`
    : `intitle:${bookSearchTitle(book)}${book.author ? ` inauthor:${book.author}` : ""}`;
  const url = `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&maxResults=10`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: { "User-Agent": "osbornm.github.io-books/1.0" },
    cache: "force-cache",
  });

  if (response.status === 429) googleBooksQuotaExhausted = true;
  if (!response.ok) return undefined;

  const data = (await response.json()) as GoogleBooksResponse;
  const match = selectGoogleBooksVolume(book, data.items ?? []);
  const imageLinks = match?.volumeInfo?.imageLinks;
  const result = {
    image: normalizeGoogleCoverUrl(imageLinks?.thumbnail ?? imageLinks?.smallThumbnail),
    synopsis: synopsisFromGoogleVolume(match),
    author: match?.volumeInfo?.authors?.join(", ") || undefined,
  };
  // An exact ISBN establishes identity even when that particular edition has no description.
  const author = book.author ?? result.author;
  if (isbn && !result.synopsis && author) {
    const fallback = await fetchGoogleBooks({ ...book, author, isbn: undefined, isbn13: undefined })
      .catch(() => undefined);
    if (fallback) return {
      ...result, ...fallback,
      author: result.author ?? fallback.author,
      image: result.image ?? fallback.image,
    };
  }
  return result;
}

async function fetchOpenLibraryJson<T>(url: string): Promise<T | undefined> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: { "User-Agent": "osbornm.github.io-books/1.0" },
      cache: "force-cache",
    });
    return response.ok ? await response.json() as T : undefined;
  } catch {
    // A missing edition or failed provider must not prevent the remaining matches being tried.
    return undefined;
  }
}

function openLibraryDescription(record: OpenLibraryEditionOrWork | undefined) {
  if (record?.languages?.length &&
      !record.languages.some((language) => language.key === "/languages/eng")) return undefined;
  return typeof record?.description === "string" ? record.description : record?.description?.value;
}

async function fetchWorkSynopsis(workKey: string, author?: string) {
  if (!/^\/works\/OL\d+W$/.test(workKey)) return undefined;
  const sourceUrl = `https://openlibrary.org${workKey}`;
  const work = await fetchOpenLibraryJson<OpenLibraryEditionOrWork>(`${sourceUrl}.json`);
  const description = openLibraryDescription(work);
  if (description) {
    const synopsis = synopsisFromDescription(description, sourceUrl, author);
    if (synopsis) return synopsis;
  }
  const editions = await fetchOpenLibraryJson<{ entries?: OpenLibraryEditionOrWork[] }>(
    `${sourceUrl}/editions.json?limit=50`,
  );
  const englishEditions = editions?.entries?.filter((edition) =>
    edition.languages?.some((language) => language.key === "/languages/eng"),
  ).slice(0, 5) ?? [];
  for (const edition of englishEditions) {
    if (!edition.key || !/^\/books\/OL\d+M$/.test(edition.key)) continue;
    const editionUrl = `https://openlibrary.org${edition.key}`;
    const details = openLibraryDescription(edition) ? edition :
      await fetchOpenLibraryJson<OpenLibraryEditionOrWork>(`${editionUrl}.json`);
    if (details?.works?.length && !details.works.some((work) => work.key === workKey)) continue;
    const editionDescription = openLibraryDescription(details);
    if (editionDescription) {
      const synopsis = synopsisFromDescription(editionDescription, editionUrl, author);
      if (synopsis) return synopsis;
    }
  }
  return undefined;
}

async function fetchOpenLibrarySynopsis(book: Book) {
  const isbn = normalizeIsbn(book.isbn13 ?? book.isbn);
  const triedWorks = new Set<string>();
  let author = book.author;
  if (isbn) {
    if (!author) {
      const details = await fetchByIsbn(isbn).catch(() => undefined);
      author = details?.authors?.map((item) => item.name).filter(Boolean).join(", ") || undefined;
    }
    if (book.synopsis) return author ? { ...book.synopsis, author } : book.synopsis;
    const edition = await fetchOpenLibraryJson<OpenLibraryEditionOrWork>(
      `https://openlibrary.org/isbn/${isbn}.json`,
    );
    const description = openLibraryDescription(edition);
    if (description) {
      const synopsis = synopsisFromDescription(description, `https://openlibrary.org/isbn/${isbn}`, author);
      if (synopsis) return synopsis;
    }
    // Multiple linked works can be an omnibus; a component synopsis would misdescribe it.
    for (const { key } of edition?.works?.length === 1 ? edition.works : []) {
      if (!key || triedWorks.has(key)) continue;
      triedWorks.add(key);
      const synopsis = await fetchWorkSynopsis(key, author);
      if (synopsis) return synopsis;
    }
    // Title-only guessing after an ISBN miss can silently substitute an unrelated book.
    if (!author) return undefined;
  }
  const searchBook = { ...book, author };
  const query = new URLSearchParams({
    title: bookSearchTitle(searchBook),
    limit: "20",
    fields: "key,title,author_name",
    ...(author ? { author } : {}),
  });
  const results = await fetchOpenLibraryJson<OpenLibraryResponse>(`${OPEN_LIBRARY_SEARCH_URL}?${query}`);
  const matches = results?.docs?.filter((doc) =>
    matchesBookTitleAndAuthor(searchBook, doc.title, doc.author_name),
  ) ?? [];
  // Duplicate catalog works are common. Only an unresolved author identity is ambiguous.
  const authors = new Set(matches.map((doc) =>
    doc.author_name!.map((name) => name.toLowerCase().replace(/[^a-z0-9]/g, "")).sort().join(","),
  ));
  if (!matches.length || (!author && authors.size !== 1)) return undefined;
  author ??= matches[0].author_name?.join(", ");
  if (book.synopsis && author) return { ...book.synopsis, author };
  for (const match of matches.slice(0, 5)) {
    if (!match.key || triedWorks.has(match.key)) continue;
    triedWorks.add(match.key);
    const synopsis = await fetchWorkSynopsis(match.key, author);
    if (synopsis) return synopsis;
  }
  return undefined;
}

async function fetchByIsbn(isbn: string) {
  const url = `${OPEN_LIBRARY_BOOKS_URL}?bibkeys=ISBN:${encodeURIComponent(isbn)}&format=json&jscmd=data`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: {
      "User-Agent": "osbornm.github.io-books/1.0",
    },
    cache: "force-cache",
  });

  if (!response.ok) {
    return undefined;
  }

  const data = (await response.json()) as OpenLibraryBookResponse;
  return data[`ISBN:${isbn}`];
}

export async function enrichBookFromOpenLibrary(book: Book): Promise<Book> {
  let enrichedBook = book;
  try {
    const localImage = await getLocalCoverImage(book);
    enrichedBook = {
      ...book,
      image: localImage,
      synopsis: book.synopsis ?? await readBookSynopsis(book.slug),
    };
    enrichedBook.author ??= enrichedBook.synopsis?.author;

    if (!SHOULD_REMOTE_ENRICH ||
        (localImage && !SHOULD_WRITE_COVERS &&
          ((enrichedBook.synopsis && enrichedBook.author) || !SHOULD_WRITE_SYNOPSES))) {
      return enrichedBook;
    }

    const isbn = normalizeIsbn(book.isbn13 ?? book.isbn);
    const google = await fetchGoogleBooks(enrichedBook).catch(() => undefined);
    const googleImage = google?.image;
    if (!enrichedBook.synopsis || !enrichedBook.author) {
      const savedOrGoogleSynopsis = enrichedBook.synopsis ?? google?.synopsis;
      const author = enrichedBook.author ?? savedOrGoogleSynopsis?.author ?? google?.author;
      const synopsis = savedOrGoogleSynopsis && author
        ? { ...savedOrGoogleSynopsis, author }
        : await fetchOpenLibrarySynopsis({ ...enrichedBook, author, synopsis: savedOrGoogleSynopsis })
          .catch(() => undefined) ?? savedOrGoogleSynopsis;
      if (synopsis) {
        const snapshotChanged = !enrichedBook.synopsis ||
          (!enrichedBook.synopsis.author && Boolean(synopsis.author));
        enrichedBook = { ...enrichedBook, synopsis, author: author ?? synopsis.author };
        if (SHOULD_WRITE_SYNOPSES && snapshotChanged) {
          await writeBookSynopsis(book.slug, synopsis);
        }
      }
    }
    if (localImage && !SHOULD_WRITE_COVERS) return enrichedBook;

    if (isbn) {
      const isbnResult = await fetchByIsbn(isbn);
      if (isbnResult) {
        const image = await persistCoverImageLocally(
          book,
          googleImage ??
            isbnResult.cover?.large ??
            isbnResult.cover?.medium ??
            isbnResult.cover?.small ??
            localImage,
        );

        return {
          ...enrichedBook,
          openLibraryHref: isbnResult.url ?? book.openLibraryHref,
          author: enrichedBook.author ?? isbnResult.authors?.[0]?.name,
          image,
        };
      }

      const image = await persistCoverImageLocally(book, googleImage ?? localImage);
      return {
        ...enrichedBook,
        image,
      };
    }

    const doc = await searchOpenLibrary("title", book.title);
    if (!doc) {
      const image = await persistCoverImageLocally(book, googleImage ?? localImage);
      return {
        ...enrichedBook,
        image,
      };
    }

    const openLibraryHref = doc.key ? `https://openlibrary.org${doc.key}` : undefined;
    const remoteImage = googleImage ?? (doc.cover_i ? buildCoverUrl(doc.cover_i) : localImage);
    const image = await persistCoverImageLocally(book, remoteImage);
    return {
      ...enrichedBook,
      openLibraryHref,
      author: enrichedBook.author ?? doc.author_name?.[0],
      image,
    };
  } catch {
    return enrichedBook;
  }
}
