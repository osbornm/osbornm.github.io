import Bookshelf from "@/data/bookService";
import BooksShell from "@/components/books/BooksShell";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_NAME, SITE_URL, defaultOgImage } from "@/data/site";

const year = new Date().getFullYear();
const title = `Books I'm reading in ${year}`;
const description = `Books Matthew Osborn is reading in ${year}, with notes and links from the personal bookshelf.`;
const url = `${SITE_URL}/books`;

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

export default async function CurrentBooksPage() {
  const books = await Bookshelf.getCurrentYearWithOpenLibrary();
  const years = Bookshelf.getYearList();

  return (
    <Suspense fallback={null}>
      <BooksShell books={books} year={year} years={years} />
    </Suspense>
  );
}
