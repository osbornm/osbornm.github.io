import { books } from "./books";
import { Book, Category } from "./types";
import { enrichBookFromOpenLibrary } from "./openLibrary";
import { cache } from "react";

class BookShelf {
  private getEnrichedBooks = cache(async () => {
    const enrichedBooks: Array<Book> = [];
    for (const book of books) {
      enrichedBooks.push(await enrichBookFromOpenLibrary(book));
    }
    return enrichedBooks;
  });

  getYearList() {
    return Array.from(new Set(books.map((book) => book.year)));
  }
  getYearGroupedCategory() {
    return books.reduce((acc, book) => {
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
    return books.filter((book) => book.year === Number.parseInt(slug, 10));
  }
  getCurrentYear() {
    return books.filter((book) => book.year === new Date().getFullYear());
  }
  async getYearWithOpenLibrary(slug: string) {
    const enrichedBooks = await this.getEnrichedBooks();
    return enrichedBooks.filter(
      (book) => book.year === Number.parseInt(slug, 10),
    );
  }
  async getCurrentYearWithOpenLibrary() {
    const enrichedBooks = await this.getEnrichedBooks();
    return enrichedBooks.filter((book) => book.year === new Date().getFullYear());
  }
}

const shelf = new BookShelf();
export default shelf;
