import { randomUUID } from "crypto";
import { mkdir, readFile, rename, rm, writeFile } from "fs/promises";
import { convert } from "html-to-text";
import { marked } from "marked";
import path from "path";
import { Book, BookSynopsis } from "./types";

export type GoogleBooksVolume = {
  id?: string;
  volumeInfo?: {
    title?: string;
    subtitle?: string;
    authors?: string[];
    description?: string;
    industryIdentifiers?: Array<{ identifier?: string }>;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  };
};

export function normalizeIsbn(value?: string) {
  const isbn = value?.replace(/[^0-9Xx]/g, "").toUpperCase();
  return isbn?.length === 10 || isbn?.length === 13 ? isbn : undefined;
}

function comparableIsbn(value?: string) {
  const isbn = normalizeIsbn(value);
  if (isbn?.length !== 10) return isbn;
  const prefix = `978${isbn.slice(0, 9)}`;
  const sum = [...prefix].reduce(
    (total, digit, index) => total + Number(digit) * (index % 2 ? 3 : 1),
    0,
  );
  return `${prefix}${(10 - (sum % 10)) % 10}`;
}

function normalizeName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function matchesBookTitleAndAuthor(book: Book, title?: string, authors?: string[]) {
  const expectedTitle = book.author ? book.title.split(":")[0] : book.title;
  const candidateTitle = book.author ? title?.split(":")[0] : title;
  if (!candidateTitle || normalizeName(candidateTitle) !== normalizeName(expectedTitle)) {
    return false;
  }
  const candidateAuthors = authors?.map(normalizeName) ?? [];
  const expectedAuthors = book.author?.split(/,| & | and /).map(normalizeName);
  return candidateAuthors.length > 0 &&
    (!expectedAuthors || expectedAuthors.every((author) => candidateAuthors.includes(author)));
}

export function selectGoogleBooksVolume(book: Book, volumes: GoogleBooksVolume[]) {
  const isbn = comparableIsbn(book.isbn13 ?? book.isbn);
  if (isbn) {
    const matches = volumes.filter((volume) =>
      volume.volumeInfo?.industryIdentifiers?.some(
        (identifier) => comparableIsbn(identifier.identifier) === isbn,
      ),
    );
    return matches.find((volume) => volume.volumeInfo?.description) ?? matches[0];
  }

  const matches = volumes.filter(({ volumeInfo: info }) =>
    matchesBookTitleAndAuthor(book, [info?.title, info?.subtitle].filter(Boolean).join(": "), info?.authors),
  );
  const distinctAuthors = new Set(
    matches.map((volume) => volume.volumeInfo!.authors!.map(normalizeName).sort().join(",")),
  );
  if (distinctAuthors.size !== 1) return undefined;
  return matches.find((volume) => volume.volumeInfo?.description) ?? matches[0];
}

export function synopsisFromGoogleVolume(volume?: GoogleBooksVolume): BookSynopsis | undefined {
  if (!volume?.id || !volume.volumeInfo?.description) return undefined;
  return synopsisFromDescription(
    volume.volumeInfo.description,
    `https://books.google.com/books?id=${encodeURIComponent(volume.id)}`,
    volume.volumeInfo.authors?.join(", "),
  );
}

export function synopsisFromDescription(description: string, sourceUrl: string, author?: string): BookSynopsis | undefined {
  const html = marked.parse(description.replace(/\\\s+\\/g, "\n\n"), { async: false });
  const text = convert(html, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  }).trim();
  return text ? { text, sourceUrl, ...(author ? { author } : {}) } : undefined;
}

function snapshotPath(slug: string) {
  return path.join(process.cwd(), "src", "data", "book-synopses", `${slug}.json`);
}

export async function readBookSynopsis(slug: string): Promise<BookSynopsis | undefined> {
  try {
    const synopsis = JSON.parse(await readFile(snapshotPath(slug), "utf8"));
    if (typeof synopsis.text === "string" && synopsis.text.trim() &&
        typeof synopsis.sourceUrl === "string" && /^https:\/\//.test(synopsis.sourceUrl)) {
      return {
        text: synopsis.text,
        sourceUrl: synopsis.sourceUrl,
        ...(typeof synopsis.author === "string" && synopsis.author.trim() ? { author: synopsis.author } : {}),
      };
    }
  } catch {
    // Missing or unreadable snapshots leave the book available without a synopsis.
  }
  return undefined;
}

export async function writeBookSynopsis(slug: string, synopsis: BookSynopsis) {
  const target = snapshotPath(slug);
  const temporary = `${target}.${randomUUID()}.tmp`;
  try {
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(temporary, `${JSON.stringify(synopsis, null, 2)}\n`, { flag: "wx" });
    await rename(temporary, target);
  } catch {
    // A read-only build can still use the successful lookup for this render.
  } finally {
    await rm(temporary, { force: true }).catch(() => undefined);
  }
}
