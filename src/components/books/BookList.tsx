'use client';

import { Book } from "@/data/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CoverImage from "@/components/books/CoverImage";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeIsbn(value?: string) {
  if (!value) {
    return undefined;
  }
  const normalized = value.replace(/[^0-9Xx]/g, "").toLowerCase();
  if (normalized.length === 10 || normalized.length === 13) {
    return normalized;
  }
  return undefined;
}

const BookList = ({ books = [] }: { books: Array<Book> }) => {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const isAllPage = pathname === "/books/all";

  useEffect(() => {
    const updateHash = () => {
      const hash = window.location.hash;
      setActiveHash(hash);
      if (hash.startsWith("#book-")) {
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
      }
    };

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [books]);

  if (!books.length) return <div>Currently nothing on the shelf</div>;
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:gap-6 lg:grid-cols-3 p-6 md:p-8 px-6 md:px-16 lg:px-20">
        {books.map((book) => {
          const bookIsbn = normalizeIsbn(book.isbn13 ?? book.isbn);
          const id = bookIsbn
            ? `book-${bookIsbn}`
            : `book-${toSlug(`${book.year}-${book.title}`)}`;
          return (
            <article
              id={id}
              key={`${book.year}-${book.title}`}
              className={`relative rounded-lg border transition-all duration-500 ${
                activeHash === `#${id}`
                  ? "border-sky-300 ring-2 ring-sky-300/60"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              <Link
                href={`/books/${book.slug}`}
                className="flex h-full flex-row items-start gap-4 rounded-lg p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
              >
                <div className="w-24 md:w-28 shrink-0 overflow-hidden rounded-md bg-white/5 aspect-[2/3]">
                  <CoverImage
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    className="h-full w-full object-cover object-center"
                    fallbackText="No cover art available"
                    fallbackClassName="flex h-full w-full items-center justify-center px-2 text-center text-sm text-gray-400"
                  />
                </div>
                <div className="relative z-10 min-w-0 flex-1">
                  <div className="flex items-center gap-x-4 text-xs">
                    {book.category}
                  </div>
                  <h5 className="mb-2 mt-2 text-lg font-bold lg:text-xl">{book.title}</h5>
                  {isAllPage && (
                    <p className="mb-2 text-sm text-gray-300">Year read: {book.year}</p>
                  )}
                  {book.author && (
                    <p className="mb-3 text-sm text-gray-300">{book.author}</p>
                  )}
                  <span className="inline-block text-md text-gray-200">See details</span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </>
  );
};

export default BookList;
