import Link from "next/link";
import type { CuratedListEntry } from "@/data/bookService";
import type { Book } from "@/data/types";
import CoverImage from "@/components/books/CoverImage";

function BookCard({ book }: { book: Book }) {
  const detailsHref = book.openLibraryHref ?? book.href;

  return (
    <article className="relative flex flex-row items-start gap-4 rounded-lg border border-white/10 p-4 transition-all duration-500 hover:border-white/25">
      <div className="w-24 shrink-0 overflow-hidden rounded-md bg-white/5 md:w-28">
        <div className="aspect-[2/3]">
          <CoverImage
            src={book.image}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover object-center"
            fallbackText="No cover art available"
            fallbackClassName="flex h-full w-full items-center justify-center px-2 text-center text-sm text-gray-400"
          />
        </div>
      </div>
      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-x-4 text-xs">{book.category}</div>
        <h5 className="mb-2 mt-2 text-lg font-bold lg:text-xl">{book.title}</h5>
        {book.author && <p className="mb-3 text-sm text-gray-300">{book.author}</p>}
        {detailsHref ? (
          <Link
            href={detailsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-md text-gray-200 hover:underline"
          >
            See details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ml-1 inline-block size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </Link>
        ) : (
          <p className="text-md text-gray-400">Details unavailable</p>
        )}
      </div>
    </article>
  );
}

function SeriesCoverStack({ books }: { books: Array<Book> }) {
  const covers = [
    ...books.filter((book) => Boolean(book.image)),
    ...books.filter((book) => !book.image),
  ].slice(0, 3);
  const coverSlots = [2, 1, 0] as const;

  return (
    <div className="w-24 shrink-0 pb-3 pr-3 md:w-28 md:pb-4 md:pr-4">
      <div className="relative aspect-[2/3] overflow-visible">
        {coverSlots.map((slot) => {
          const book = covers[slot];
          const offset = slot * 6;
          if (!book) {
            return null;
          }
          return (
            <div
              key={`${book.year}-${book.title}-stack`}
              className="absolute inset-0 overflow-hidden rounded-md border border-white/20 bg-white/5 shadow-lg"
              style={{
                transform: `translate(${offset}px, ${offset}px)`,
                zIndex: slot + 1,
              }}
            >
              <CoverImage
                src={book.image}
                alt={`Cover of ${book.title}`}
                className="h-full w-full object-cover object-center"
                fallbackText={book.title}
                fallbackClassName="flex h-full w-full items-center justify-center px-2 text-center text-[10px] leading-tight text-gray-300"
              />
            </div>
          );
        })}
        {!covers.length ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-2 text-center text-sm text-gray-400">
            No covers
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SeriesCard({
  series,
  books,
}: {
  series: string;
  books: Array<Book>;
}) {
  const previewTitles = books.slice(0, 3).map((book) => book.title);

  return (
    <article className="relative flex flex-row items-start gap-4 rounded-lg border border-white/10 p-4 transition-all duration-500 hover:border-white/25">
      <SeriesCoverStack books={books} />
      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-x-4 text-xs text-gray-300">Series</div>
        <h5 className="mb-2 mt-2 text-lg font-bold lg:text-xl">{series}</h5>
        <p className="mb-3 text-sm text-gray-300">
          {books.length} {books.length === 1 ? "book" : "books"}
        </p>
        {previewTitles.length ? (
          <p className="text-sm text-gray-400">
            Includes: {previewTitles.join(" • ")}
          </p>
        ) : (
          <p className="text-sm text-gray-400">No matching books found</p>
        )}
      </div>
    </article>
  );
}

export default function CuratedEntriesList({
  entries,
}: {
  entries: Array<CuratedListEntry>;
}) {
  if (!entries.length) {
    return <div>Currently nothing on the shelf</div>;
  }

  return (
    <div className="grid gap-6 px-6 py-6 md:grid-cols-2 md:px-16 md:py-8 lg:grid-cols-3 lg:gap-6 lg:px-20">
      {entries.map((entry) =>
        entry.kind === "book" ? (
          <BookCard key={entry.key} book={entry.book} />
        ) : (
          <SeriesCard key={entry.key} series={entry.series} books={entry.books} />
        ),
      )}
    </div>
  );
}
