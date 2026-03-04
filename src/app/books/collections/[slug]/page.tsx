import CuratedEntriesList from "@/components/books/CuratedEntriesList";
import Bookshelf from "@/data/bookService";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CuratedBooksCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug;
  const list = Bookshelf.getCuratedList(slug);
  if (!list) {
    notFound();
  }

  const entries = await Bookshelf.getCuratedListEntries(slug);
  if (!entries) {
    notFound();
  }

  return (
    <main className="mx-auto w-full px-6 py-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link href="/books/collections" className="text-sm text-gray-300 hover:underline">
            All curated collections
          </Link>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">{list.title}</h1>
          <p className="mt-3 text-gray-300">{list.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <CuratedEntriesList entries={entries} />
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return Bookshelf.getCuratedLists().map((list) => ({
    slug: list.slug,
  }));
}
