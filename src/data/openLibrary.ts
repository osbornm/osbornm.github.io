import { Book } from "./types";
import { createHash } from "crypto";
import { mkdir, stat, writeFile } from "fs/promises";
import path from "path";

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

type GoogleBooksVolume = {
  volumeInfo?: {
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
};

type GoogleBooksResponse = {
  items?: GoogleBooksVolume[];
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

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeIsbn(value?: string) {
  if (!value) {
    return undefined;
  }
  const normalized = value.replace(/[^0-9Xx]/g, "").toUpperCase();
  if (normalized.length === 10 || normalized.length === 13) {
    return normalized;
  }
  return undefined;
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

function getPublicCoverPath(filePath: string) {
  return `${LOCAL_COVER_PREFIX}/${path.basename(filePath)}`;
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

async function fetchGoogleBooksImage(query: string) {
  const url = `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&maxResults=1`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "osbornm.github.io-books/1.0",
    },
    cache: "force-cache",
  });

  if (!response.ok) {
    return undefined;
  }

  const data = (await response.json()) as GoogleBooksResponse;
  const imageLinks = data.items?.[0]?.volumeInfo?.imageLinks;
  return normalizeGoogleCoverUrl(
    imageLinks?.thumbnail ?? imageLinks?.smallThumbnail,
  );
}

async function fetchByIsbn(isbn: string) {
  const url = `${OPEN_LIBRARY_BOOKS_URL}?bibkeys=ISBN:${encodeURIComponent(isbn)}&format=json&jscmd=data`;
  const response = await fetch(url, {
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
  try {
    const isbn = normalizeIsbn(book.isbn13 ?? book.isbn);
    const googleImage = isbn
      ? await fetchGoogleBooksImage(`isbn:${isbn}`)
      : await fetchGoogleBooksImage(`intitle:${book.title}`);

    if (isbn) {
      const isbnResult = await fetchByIsbn(isbn);
      if (isbnResult) {
        const image = await persistCoverImageLocally(
          book,
          googleImage ??
            isbnResult.cover?.large ??
            isbnResult.cover?.medium ??
            isbnResult.cover?.small ??
            book.image,
        );

        return {
          ...book,
          openLibraryHref: isbnResult.url ?? book.openLibraryHref,
          author: book.author ?? isbnResult.authors?.[0]?.name,
          image,
        };
      }

      const image = await persistCoverImageLocally(book, googleImage ?? book.image);
      return {
        ...book,
        image,
      };
    }

    const doc = await searchOpenLibrary("title", book.title);
    if (!doc) {
      const image = await persistCoverImageLocally(book, googleImage ?? book.image);
      return {
        ...book,
        image,
      };
    }

    const openLibraryHref = doc.key ? `https://openlibrary.org${doc.key}` : undefined;
    const remoteImage = googleImage ?? (doc.cover_i ? buildCoverUrl(doc.cover_i) : book.image);
    const image = await persistCoverImageLocally(book, remoteImage);
    const author = doc.author_name?.[0] ?? book.author;

    return {
      ...book,
      openLibraryHref,
      author: book.author ?? author,
      image,
    };
  } catch {
    return book;
  }
}
