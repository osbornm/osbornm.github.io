import Bookshelf from "@/data/bookService";
import BooksShell from "@/components/books/BooksShell";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_NAME, SITE_URL, defaultOgImage } from "@/data/site";

const title = "All books";
const description =
  "Complete bookshelf for Matthew Osborn — every title logged on osbornm.com, filterable by year and category.";
const url = `${SITE_URL}/books/all`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    url,
    siteName: SITE_NAME,
    title,
    description,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [defaultOgImage],
  },
};

export default async function AllBooksPage() {
  const books = await Bookshelf.getAllWithOpenLibrary();
  const years = Bookshelf.getYearList();

  return (
    <Suspense fallback={null}>
      <BooksShell books={books} years={years} />
    </Suspense>
  );
}
