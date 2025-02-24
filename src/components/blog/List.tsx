import { Post } from "@/blogData";
import Link from "next/link";

const PostList = ({ posts = [] }: { posts: Array<Post> }) => {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-1 lg:gap-6 lg:grid-cols-2 p-6 md:p-8 px-6 md:px-16 lg:px-20">
        {posts.map((post) => (
          <Link href={post.href} key={post.title}
            className="flex flex-col p-4 space-y-6 transition-all duration-500 rounded-lg lg:p-6 lg:flex-row lg:space-y-0 lg:space-x-6 group">
            <article className="flex-1">
              <div className="flex items-center gap-x-4 text-xs text-gray-400">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
                )}
              </div>
              <h3 className="mb-2 mt-1 text-2xl font-bold">{post.title}</h3>
              <p className="md:line-clamp-3">{post.excerpt}</p>
              <p className="text-md text-gray-200 group-hover:underline">
                Read It
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 size-3 inline-block">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </p>
            </article>
          </Link>
        ))}
      </div >
    </>
  );
};

export default PostList;