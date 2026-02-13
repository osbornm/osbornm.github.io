import Bookshelf from "@/data/bookService";
import BookList from "@/components/books/BookList";
import BooksHeader from "@/components/books/header";

export default async function BooksYearPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug;
  const books = Bookshelf.getYear(slug);

  return (
    <>
      <BooksHeader year={Number.parseInt(slug, 10)} />
      <div className="flex flex-col items-center justify-center">
        <BookList books={books} />
      </div>
    </>
  );
}

export function generateStaticParams() {
  return Bookshelf.getYearList().map((year) => ({
    slug: year.toString(),
  }));
}
