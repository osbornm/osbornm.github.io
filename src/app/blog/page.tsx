import { getPagingInfo, getPostPage } from "@/blogData";
import PostList from "@/components/blog/List";
import BlogListHeader from "@/components/blog/ListHeader";
import { Pagination } from "@/components/blog/Pagination";

export default async function Page() {
  const currentPage = 1;
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