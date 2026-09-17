import type { MetadataRoute } from "next";
import { getPosts } from "@/blogData";
import Bookshelf from "@/data/bookService";
import { SITE_URL } from "@/data/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const years = Bookshelf.getYearList();
  const bookSlugs = Bookshelf.getBookSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/books`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/books/all`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/talks`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const yearRoutes: MetadataRoute.Sitemap = years.map((year) => ({
    url: `${SITE_URL}/books/${year}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const bookRoutes: MetadataRoute.Sitemap = bookSlugs.map((slug) => ({
    url: `${SITE_URL}/books/${slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPosts();
    blogRoutes = posts.map((post) => ({
      url: `${SITE_URL}/blog/post/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: "never" as const,
      priority: 0.4,
    }));
  } catch {
    // optional at build
  }

  return [...staticRoutes, ...yearRoutes, ...bookRoutes, ...blogRoutes];
}
