import Bookshelf from "@/data/bookService";
import BooksShell from "@/components/books/BooksShell";

export default async function CurrentBooksPage() {
  const books = await Bookshelf.getCurrentYearWithOpenLibrary();
  const years = Bookshelf.getYearList();

  return (
    <BooksShell books={books} year={new Date().getFullYear()} years={years} />
  );
}
