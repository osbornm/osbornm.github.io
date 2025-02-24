import Bookshelf from "@/data/bookService";
import BookList from "@/components/bookshelf/BookList";
import BookshelfHeader from "@/components/bookshelf/header";

export default async function BookshelfYearPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const books = Bookshelf.getYear(slug);

  return (
    <>
      <BookshelfHeader year={parseInt(slug)} />
      <div className="flex flex-col items-center justify-center">
        <BookList books={books} />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const result = (Bookshelf.getYearList()).map((year) => ({
    slug: year.toString(),
  }));
  console.log(result);
  return result;
}
