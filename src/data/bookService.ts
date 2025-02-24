import { books } from "./books";
import { Book, Category } from "./types";

class BookShelf {
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
    return books.filter((book) => book.year === parseInt(slug));
  }
  getCurrentYear() {
    return books.filter((book) => book.year === new Date().getFullYear());
  }
}

const shelf = new BookShelf();
export default shelf;
