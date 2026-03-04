import { books } from "./books";
import { Book, Category } from "./types";
import { enrichBookFromOpenLibrary } from "./openLibrary";
import { cache } from "react";
import {
  CuratedBookList,
  CuratedBookRef,
  CuratedBookSeriesRef,
  curatedBookLists,
} from "./curatedBookLists";

export interface CuratedBookEntry {
  kind: "book";
  key: string;
  book: Book;
}

export interface CuratedSeriesEntry {
  kind: "series";
  key: string;
  series: string;
  books: Array<Book>;
}

export type CuratedListEntry = CuratedBookEntry | CuratedSeriesEntry;

function normalizeRef(value: string) {
  return value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

function titleRef(value: string) {
  return value.trim().toLowerCase();
}

function isSeriesRef(ref: CuratedBookRef): ref is CuratedBookSeriesRef {
  return (
    typeof ref === "object" &&
    ref !== null &&
    "series" in ref &&
    typeof ref.series === "string"
  );
}

function getSeriesRefValue(ref: CuratedBookRef) {
  if (isSeriesRef(ref)) {
    return ref.series;
  }

  if (typeof ref === "string") {
    const match = ref.match(/^series:\s*(.+)$/i);
    return match?.[1];
  }

  return undefined;
}

function extractSeriesFromTitle(title: string) {
  const match =
    title.match(/:\s*([^,]+),\s*(?:Book|Episode)\s+\d+/i) ??
    title.match(/^(.+),\s*(?:Book|Episode)\s+\d+/i);

  return match?.[1] ? titleRef(match[1]) : undefined;
}

function isBookInSeries(book: Book, seriesRefValue: string) {
  const series = titleRef(seriesRefValue);
  if (!series) {
    return false;
  }

  const explicitSeries = extractSeriesFromTitle(book.title);
  if (explicitSeries) {
    return (
      explicitSeries === series ||
      explicitSeries.includes(series) ||
      titleRef(book.title).includes(series)
    );
  }

  return titleRef(book.title).includes(series);
}

function getBookIdentity(book: Book) {
  if (book.isbn13) {
    return `isbn13:${normalizeRef(book.isbn13)}`;
  }
  if (book.isbn) {
    return `isbn:${normalizeRef(book.isbn)}`;
  }
  if (book.asin) {
    return `asin:${normalizeRef(book.asin)}`;
  }
  return `title:${titleRef(book.title)}`;
}

function sortSeriesBooks(booksToSort: Array<Book>) {
  return [...booksToSort].sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    }
    return a.title.localeCompare(b.title);
  });
}

function isYearVisibleBook(book: Book) {
  return !book.seriesOnly;
}

class BookShelf {
  private getEnrichedBooks = cache(async () => {
    const enrichedBooks: Array<Book> = [];
    for (const book of books) {
      enrichedBooks.push(await enrichBookFromOpenLibrary(book));
    }
    return enrichedBooks;
  });

  getYearList() {
    return Array.from(
      new Set(books.filter(isYearVisibleBook).map((book) => book.year)),
    );
  }
  getYearGroupedCategory() {
    return books.filter(isYearVisibleBook).reduce((acc, book) => {
      if (!acc[book.year]) {
        acc[book.year] = {} as Record<Category, Book[]>;
      }
      if (!acc[book.year][book.category]) {
        acc[book.year][book.category] = [];
      }
      acc[book.year][book.category].push(book);
      return acc;
    }, {} as Record<number, Record<Category, Book[]>>);
  }

  getYear(slug: string) {
    return books.filter(
      (book) => isYearVisibleBook(book) && book.year === Number.parseInt(slug, 10),
    );
  }
  getCurrentYear() {
    return books.filter(
      (book) =>
        isYearVisibleBook(book) && book.year === new Date().getFullYear(),
    );
  }
  async getYearWithOpenLibrary(slug: string) {
    const enrichedBooks = await this.getEnrichedBooks();
    return enrichedBooks.filter(
      (book) => isYearVisibleBook(book) && book.year === Number.parseInt(slug, 10),
    );
  }
  async getCurrentYearWithOpenLibrary() {
    const enrichedBooks = await this.getEnrichedBooks();
    return enrichedBooks.filter(
      (book) =>
        isYearVisibleBook(book) && book.year === new Date().getFullYear(),
    );
  }
  async getAllWithOpenLibrary() {
    const enrichedBooks = await this.getEnrichedBooks();
    return enrichedBooks.filter(isYearVisibleBook);
  }
  getCuratedLists() {
    return curatedBookLists;
  }
  getCuratedList(slug: string): CuratedBookList | undefined {
    return curatedBookLists.find((list) => list.slug === slug);
  }
  async getCuratedListEntries(slug: string): Promise<Array<CuratedListEntry> | undefined> {
    const list = this.getCuratedList(slug);
    if (!list) {
      return undefined;
    }

    const enrichedBooks = await this.getEnrichedBooks();
    const byRef = new Map<string, Book>();

    for (const book of enrichedBooks) {
      if (book.isbn13) {
        byRef.set(normalizeRef(book.isbn13), book);
      }
      if (book.isbn) {
        byRef.set(normalizeRef(book.isbn), book);
      }
      if (book.asin) {
        byRef.set(normalizeRef(book.asin), book);
      }
      byRef.set(titleRef(book.title), book);
    }

    const resolved: Array<CuratedListEntry> = [];
    const seen = new Set<string>();

    const addBookIfNew = (book: Book | undefined) => {
      if (!book) {
        return;
      }
      const identity = getBookIdentity(book);
      if (seen.has(identity)) {
        return;
      }
      seen.add(identity);
      resolved.push({
        kind: "book",
        key: identity,
        book,
      });
    };

    for (const ref of list.bookRefs) {
      const seriesRefValue = getSeriesRefValue(ref);
      if (seriesRefValue) {
        const seriesBooks: Array<Book> = [];
        for (const book of enrichedBooks) {
          if (isBookInSeries(book, seriesRefValue)) {
            const identity = getBookIdentity(book);
            if (seen.has(identity)) {
              continue;
            }
            seen.add(identity);
            seriesBooks.push(book);
          }
        }
        resolved.push({
          kind: "series",
          key: `series:${titleRef(seriesRefValue)}`,
          series: seriesRefValue.trim(),
          books: sortSeriesBooks(seriesBooks),
        });
        continue;
      }

      if (typeof ref === "string") {
        addBookIfNew(byRef.get(normalizeRef(ref)) ?? byRef.get(titleRef(ref)));
        continue;
      }
    }

    return resolved;
  }
  async getCuratedListBooks(slug: string) {
    const entries = await this.getCuratedListEntries(slug);
    if (!entries) {
      return undefined;
    }
    return entries.flatMap((entry) =>
      entry.kind === "book" ? [entry.book] : entry.books,
    );
  }
}

const shelf = new BookShelf();
export default shelf;
