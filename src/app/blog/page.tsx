import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, defaultOgImage } from "@/data/site";

const title = "Blog archive";
const description =
  "Archival blog posts from Matthew Osborn — older writing kept for reference.";
const url = `${SITE_URL}/blog`;

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