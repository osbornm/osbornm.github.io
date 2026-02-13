import Bookshelf from "@/data/bookService";
import BooksShell from "@/components/books/BooksShell";

export default function CurrentBooksPage() {
  const books = Bookshelf.getCurrentYear();
  const years = Bookshelf.getYearList();

  return (
    <BooksShell books={books} year={new Date().getFullYear()} years={years} />
  );
}
