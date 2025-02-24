import Bookshelf from "@/data/bookService";
import BookList from "@/components/bookshelf/BookList";
import BookshelfHeader from "@/components/bookshelf/header";

export default function CurrentBookshelfPage() {
  const books = Bookshelf.getCurrentYear();

  return (
    <>
      <BookshelfHeader year={new Date().getFullYear()} />
      <div className="flex flex-col items-center justify-center">
        <BookList books={books} />
      </div>
    </>
  );
}

