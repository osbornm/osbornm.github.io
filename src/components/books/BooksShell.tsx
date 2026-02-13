'use client';

import { useMemo } from "react";
import BookList from "@/components/books/BookList";
import BooksHeader from "@/components/books/header";
import { Book, Category } from "@/data/types";
import { useSearchParams } from "next/navigation";

export type Filter = "all" | "fiction" | "nonfiction";

function parseFilter(value: string | null): Filter {
  if (value === "fiction" || value === "nonfiction") {
    return value;
  }
  return "all";
}

export default function BooksShell({
  books,
  year,
  years,
}: {
  books: Array<Book>;
  year?: number;
  years: Array<number>;
}) {
  const searchParams = useSearchParams();
  const filter = parseFilter(searchParams.get("filter"));

  const filteredBooks = useMemo(() => {
    if (filter === "all") {
      return books;
    }
    const category =
      filter === "fiction" ? Category.Fiction : Category.NonFiction;
    return books.filter((book) => book.category === category);
  }, [books, filter]);

  return (
    <>
      <BooksHeader
        year={year}
        years={years}
        books={books}
        filter={filter}
      />
      <div className="flex flex-col items-center justify-center">
        <BookList books={filteredBooks} />
      </div>
    </>
  );
}
