import { getPostBySlug, getPosts } from "@/blogData"
import "highlight.js/styles/github.css";


export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const data = await getPostBySlug(slug)
  if (!data) {
    // TODO: should redirect to a four-oh-four page
    return <div>Not Found</div>
  }


  return (
    <>
      <div className="relative isolate overflow-hidden py-8 lg:py-16">
        <div className="mx-auto max-w-7xl px-10 lg:px-20">
          <time className="flex mb-2">{new Date(data.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</time>
          <div className="mx-auto max-w-4xl lg:mx-0">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">{data.title}</h2>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8 md:line-clamp-4">
              {data.excerpt}
            </p>

          </div>
        </div>
      </div>
      <hr className="mx-10 lg:mx-20 mb-10" />
      <main className="mx-auto max-w-7xl px-10 lg:px-20 blog">
        <data.Component />
      </main>
    </>)
}

export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const { rawFrontMatter: frontmatter } = await getPostBySlug(slug) || { rawFrontMatter: { title: 'Not Found' } }
  return {
    title: frontmatter.title,
  }
}

