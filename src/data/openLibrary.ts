import { Book } from "./types";

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
        return {
          ...book,
          openLibraryHref: isbnResult.url ?? book.openLibraryHref,
          author: isbnResult.authors?.[0]?.name ?? book.author,
          image:
            googleImage ??
            isbnResult.cover?.large ??
            isbnResult.cover?.medium ??
            isbnResult.cover?.small ??
            book.image,
        };
      }
    }

    const doc = await searchOpenLibrary("title", book.title);
    if (!doc) {
      return {
        ...book,
        image: googleImage ?? book.image,
      };
    }

    const openLibraryHref = doc.key ? `https://openlibrary.org${doc.key}` : undefined;
    const image = doc.cover_i ? buildCoverUrl(doc.cover_i) : book.image;
    const author = doc.author_name?.[0] ?? book.author;

    return {
      ...book,
      openLibraryHref,
      author,
      image: googleImage ?? image,
    };
  } catch {
    return book;
  }
}
