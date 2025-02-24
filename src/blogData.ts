import { FC } from "react";
import path from "path";
import fs from "fs";

export interface FrontMatter {
  title: string;
  date: string;
  excerpt: string;
}

export interface Post {
  rawFrontMatter: FrontMatter;
  title: string;
  date: string;
  excerpt: string;
  fileName: string;
  slug: string;
  Component: FC;
  href: string;
}

let posts: Post[] = [];

const postsDirectory = path.join(process.cwd(), "src/content");
async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map(async (fileName) => {
    const { default: post, frontmatter: rawFrontMatter = {} } = await import(
      `@/content/${fileName}`
    );

    // Combine the data with the id
    const slug = rawFrontMatter.slug || fileName.replace(/\.mdx?$/, "");
    return {
      rawFrontMatter,
      title: rawFrontMatter.title || slug,
      date: rawFrontMatter.date,
      excerpt: rawFrontMatter.excerpt,
      slug: slug,
      Component: post,
      fileName,
      href: `/blog/post/${slug}`,
    } as Post;
  });
  const foo = await Promise.all(allPostsData);
  // Sort posts by date
  return foo.sort((a, b) => {
    if (a.rawFrontMatter.date < b.rawFrontMatter.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPosts() {
  if (posts.length === 0) {
    posts = await getSortedPostsData();
  }
  return posts;
}

const PAGING_SIZE = 10;
export async function getPagingInfo() {
  const posts = await getPosts();
  const pageCount = Math.ceil(posts.length / PAGING_SIZE);
  return {
    total: posts.length,
    pageSize: PAGING_SIZE,
    pageCount,
  };
}

export async function getPostPage(page: number) {
  const posts = await getPosts();
  const start = (page - 1) * PAGING_SIZE;
  const end = start + PAGING_SIZE;
  return posts.slice(start, end);
}

export async function getPostBySlug(slug: string) {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

export default posts;
