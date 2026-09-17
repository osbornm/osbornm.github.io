import Bookshelf from "@/data/bookService";
import BooksShell from "@/components/books/BooksShell";
import CoverImage from "@/components/books/CoverImage";
import CopyBookLink from "@/components/books/CopyBookLink";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = { params: Promise<{ slug: string }> };

const siteUrl = "https://osbornm.com";
const bookUrl = (slug: string) => `${siteUrl}/books/${slug}`;
const isYear = (slug: string) =>
  Bookshelf.getYearList().some((year) => year.toString() === slug);

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;

  if (isYear(slug)) {
    const books = await Bookshelf.getYearWithOpenLibrary(slug);
    return (
      <Suspense fallback={null}>
        <BooksShell books={books} year={Number(slug)} years={Bookshelf.getYearList()} />
      </Suspense>
    );
  }

  const details = await Bookshelf.getBookWithOpenLibrary(slug);
  if (!details) {
    notFound();
  }
  const { book, yearsRead } = details;
  const externalHref = book.openLibraryHref ?? book.href ?? book.synopsis?.sourceUrl;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-20 lg:py-16">
      <Link href="/books/all" className="text-sm text-gray-300 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300">
        <span aria-hidden="true">&larr; </span>All books
      </Link>

      <article className="mt-8 grid gap-8 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-10">
        <div className="aspect-[2/3] w-40 overflow-hidden rounded-lg bg-white/5 shadow-xl sm:w-full">
          <CoverImage
            src={book.image}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover object-center"
            fallbackText="No cover art available"
            fallbackClassName="flex h-full w-full items-center justify-center px-4 text-center text-sm text-gray-400"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm text-gray-300">{book.category}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{book.title}</h1>
          {book.author && <p className="mt-3 text-xl text-gray-300">{book.author}</p>}
          <p className="mt-4 text-sm text-gray-400">
            {yearsRead.length === 1 ? "Year read" : "Years read"}: {yearsRead.join(", ")}
          </p>

          <div className="mt-6 flex flex-wrap items-start gap-5">
            <CopyBookLink url={bookUrl(book.slug)} />
            <a
              href={externalHref ?? `https://openlibrary.org/search?q=${encodeURIComponent(book.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-sm text-gray-200 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
            >
              {externalHref ? "View book details" : "Find this book"} <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          <section aria-labelledby="synopsis-heading" className="mt-10 border-t border-white/10 pt-8">
            <h2 id="synopsis-heading" className="text-xl font-semibold text-white">About the book</h2>
            {book.synopsis ? (
              <>
                <p className="mt-4 whitespace-pre-line break-words text-base leading-7 text-gray-300">{book.synopsis.text}</p>
                <p className="mt-4 text-sm text-gray-400">
                  Synopsis source:{" "}
                  <a href={book.synopsis.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200">
                    {book.synopsis.sourceName ?? (book.synopsis.sourceUrl.startsWith("https://openlibrary.org/") ? "Open Library" : "Google Books")}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </p>
              </>
            ) : (
              <p className="mt-4 text-gray-400">Synopsis unavailable.</p>
            )}
          </section>
        </div>
      </article>
    </main>
  );
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...Bookshelf.getYearList().map(String),
    ...Bookshelf.getBookSlugs(),
  ].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isYear(slug)) {
    return { title: `${slug} Books | Matthew M. Osborn` };
  }

  const details = await Bookshelf.getBookWithOpenLibrary(slug);
  if (!details) {
    notFound();
  }
  const { book } = details;
  const summary = book.synopsis?.text.replace(/\s+/g, " ").trim()
    ?? `${book.title}${book.author ? ` by ${book.author}` : ""}. From Matthew M. Osborn's bookshelf.`;
  const description = summary.length > 160 ? `${summary.slice(0, 157).trimEnd()}...` : summary;
  const title = `${book.title} | Matthew M. Osborn`;
  const images = book.image
    ? [{
        url: new URL(book.image, siteUrl).toString(),
        alt: `Cover of ${book.title}`,
        // Slack is pickier about OG images without explicit size hints.
        width: 400,
        height: 600,
      }]
    : [];

  return {
    title,
    description,
    alternates: { canonical: bookUrl(slug) },
    openGraph: {
      type: "website",
      title,
      description,
      url: bookUrl(slug),
      siteName: "Matthew M. Osborn",
      images,
    },
    // Compact summary card (cover thumb beside text). Use website type — Slack often drops rich fields for og:type=book.
    twitter: { card: "summary", title, description, images },
  };
}
