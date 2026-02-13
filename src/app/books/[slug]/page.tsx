import Bookshelf from "@/data/bookService";
import BooksShell from "@/components/books/BooksShell";

export default async function BooksYearPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug;
  const books = await Bookshelf.getYearWithOpenLibrary(slug);
  const years = Bookshelf.getYearList();

  return (
    <BooksShell books={books} year={Number.parseInt(slug, 10)} years={years} />
  );
}

export function generateStaticParams() {
  return Bookshelf.getYearList().map((year) => ({
    slug: year.toString(),
  }));
}
