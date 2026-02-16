import Bookshelf from "@/data/bookService";
import BooksShell from "@/components/books/BooksShell";
import { Suspense } from "react";

export default async function AllBooksPage() {
  const books = await Bookshelf.getAllWithOpenLibrary();
  const years = Bookshelf.getYearList();

  return (
    <Suspense fallback={null}>
      <BooksShell books={books} years={years} />
    </Suspense>
  );
}
