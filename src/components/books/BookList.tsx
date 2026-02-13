'use client';

import { Book } from "@/data/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

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
  const [activeHash, setActiveHash] = useState("");
  const pathname = usePathname();
  const isAllPage = pathname === "/books/all";

  const booksWithIds = useMemo(() => {
    return books.map((book) => {
      const bookIsbn = normalizeIsbn(book.isbn13 ?? book.isbn);
      const id = bookIsbn
        ? `book-${bookIsbn}`
        : `book-${toSlug(`${book.year}-${book.title}`)}`;
      return { ...book, id };
    });
  }, [books]);

  useEffect(() => {
    const updateHash = () => {
      setActiveHash(window.location.hash);
    };

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const handleCardClick = (id: string) => {
    const hash = `#${id}`;
    setActiveHash(hash);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  };

  if (!books.length) return <div>Currently nothing on the shelf</div>;
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:gap-6 lg:grid-cols-3 p-6 md:p-8 px-6 md:px-16 lg:px-20">
        {booksWithIds.map((book) => {
          const detailsHref = book.openLibraryHref ?? book.href;
          const isActive = activeHash === `#${book.id}`;
          return (
            <article
              id={book.id}
              key={`${book.year}-${book.title}`}
              onClick={() => handleCardClick(book.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleCardClick(book.id);
                }
              }}
              role="link"
              tabIndex={0}
              className={`relative flex flex-row items-start gap-4 p-4 transition-all duration-500 rounded-lg group border ${
                isActive
                  ? "border-sky-300 ring-2 ring-sky-300/60"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              <div className="w-24 md:w-28 shrink-0 overflow-hidden rounded-md bg-white/5 aspect-[2/3]">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-2 text-center text-sm text-gray-400">
                    No cover art avalible
                  </div>
                )}
              </div>
              <div className="relative z-10 flex-1">
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
                {detailsHref ? (
                  <Link
                    href={detailsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-md text-gray-200 hover:underline"
                  >
                    See details
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 size-3 inline-block">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </Link>
                ) : (
                  <p className="text-md text-gray-400">Details unavailable</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};

export default BookList;
