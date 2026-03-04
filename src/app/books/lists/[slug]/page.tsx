import ClientRedirect from "@/components/ClientRedirect";
import Bookshelf from "@/data/bookService";

export default async function CuratedBooksListRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug;
  return <ClientRedirect to={`/books/collections/${slug}`} />;
}

export function generateStaticParams() {
  return Bookshelf.getCuratedLists().map((list) => ({
    slug: list.slug,
  }));
}
