import ClientRedirect from "@/components/ClientRedirect";
import Bookshelf from "@/data/bookService";

export default async function BookshelfYearRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug;
  return <ClientRedirect to={`/books/${slug}`} />;
}

export function generateStaticParams() {
  return Bookshelf.getYearList().map((year) => ({
    slug: year.toString(),
  }));
}
