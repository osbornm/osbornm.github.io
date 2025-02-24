import { getPagingInfo, getPostPage } from "@/blogData";
import PostList from "@/components/blog/List";
import BlogListHeader from "@/components/blog/ListHeader";
import { Pagination } from "@/components/blog/Pagination";

export async function generateStaticParams() {
  const info = await getPagingInfo();
  return Array.from({ length: info.pageCount }).map((_, i) => ({
    page: (i + 1).toString(),
  }));

}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const slug = (await params).page
  const currentPage = parseInt(slug, 10);
  const pagingInfo = await getPagingInfo();
  const pagePosts = await getPostPage(currentPage);

  return (
    <>
      <BlogListHeader />
      <PostList posts={pagePosts} />
      <Pagination currentPage={currentPage} totalPages={pagingInfo.pageCount} />
    </>
  );
}

