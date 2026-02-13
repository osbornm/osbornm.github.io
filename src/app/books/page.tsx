import Bookshelf from "@/data/bookService";
import BooksShell from "@/components/books/BooksShell";
import { Suspense } from "react";

export default async function CurrentBooksPage() {
  const books = await Bookshelf.getCurrentYearWithOpenLibrary();
  const years = Bookshelf.getYearList();

  return (
    <Suspense fallback={null}>
      <BooksShell books={books} year={new Date().getFullYear()} years={years} />
    </Suspense>
  );
}
