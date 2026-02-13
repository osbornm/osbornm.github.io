'use client';

import { useMemo, useState } from "react";
import BookList from "@/components/books/BookList";
import BooksHeader from "@/components/books/header";
import { Book, Category } from "@/data/types";

type Filter = "all" | Category.Fiction | Category.NonFiction;

export default function BooksShell({
  books,
  year,
  years,
}: {
  books: Array<Book>;
  year: number;
  years: Array<number>;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const filteredBooks = useMemo(() => {
    if (filter === "all") {
      return books;
    }
    return books.filter((book) => book.category === filter);
  }, [books, filter]);

  return (
    <>
      <BooksHeader
        year={year}
        years={years}
        books={books}
        filter={filter}
        onFilterChange={setFilter}
      />
      <div className="flex flex-col items-center justify-center">
        <BookList books={filteredBooks} />
      </div>
    </>
  );
}
