import Bookshelf from "@/data/bookService";
import BookList from "@/components/books/BookList";
import BooksHeader from "@/components/books/header";

export default function CurrentBooksPage() {
  const books = Bookshelf.getCurrentYear();

  return (
    <>
      <BooksHeader year={new Date().getFullYear()} />
      <div className="flex flex-col items-center justify-center">
        <BookList books={books} />
      </div>
    </>
  );
}
