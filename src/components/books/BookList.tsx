import { Book } from "@/data/types";
import Link from "next/link";

const BookList = ({ books = [] }: { books: Array<Book> }) => {
  if (!books.length) return <div>Currently nothing on the shelf</div>;
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:gap-6 lg:grid-cols-3 p-6 md:p-8 px-6 md:px-16 lg:px-20">
        {books.map((book) => (
          <Link href={book.href} key={book.title}
            className="flex flex-col p-4 space-y-6 transition-all duration-500 rounded-lg lg:p-6 lg:flex-row lg:space-y-0 lg:space-x-6 group">
            <div className="flex-1">
              <div className="flex items-center gap-x-4 text-xs">
                {book.category}
              </div>
              <h5 className="mb-3 text-lg font-bold lg:text-xl">{book.title}</h5>
              <p className="text-md text-gray-200 group-hover:underline">
                Read It
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 size-3 inline-block">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default BookList;