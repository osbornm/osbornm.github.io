import Bookshelf from "@/data/bookService";
import Link from "next/link";

export default function BooksCollectionsPage() {
  const lists = Bookshelf.getCuratedLists();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 lg:px-20">
      <h1 className="text-4xl font-semibold tracking-tight text-white">Curated Collections</h1>
      <p className="mt-3 text-gray-300">
        Focused collections of books that are easy to share and revisit.
      </p>

      <div className="mt-8 grid gap-4">
        {lists.map((list) => (
          <Link
            key={list.slug}
            href={`/books/collections/${list.slug}`}
            className="rounded-lg border border-white/10 p-5 hover:border-white/25"
          >
            <h2 className="text-xl font-semibold text-white">{list.title}</h2>
            <p className="mt-2 text-gray-300">{list.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
