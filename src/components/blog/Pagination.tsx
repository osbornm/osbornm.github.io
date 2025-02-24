import Link from "next/link";


export async function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  return (
    <>
      <div className="flex justify-center items-center p-4">
        <nav className="inline-flex items-center p-1 rounded space-x-2">
          {currentPage === 1 ? (
            <span className="p-1 rounded border text-gray-500 border-gray-500" title="Currently on the first page.">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </span>
          ) : (
            <Link className="p-1 rounded border" href={currentPage === 2 ? "/blog" : `/blog/${currentPage - 1}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
          )}

          <p className="text-xl">Page {currentPage} of {totalPages}</p>

          {currentPage === totalPages ? (
            <span className="p-1 rounded border text-gray-500 border-gray-500" title="Currently on the last page.">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 19.5 21 12m0 0-7.5-7.5M21 12H3" />
              </svg>
            </span>
          ) : (
            <Link className="p-1 rounded border" href={`/blog/${currentPage + 1}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 19.5 21 12m0 0-7.5-7.5M21 12H3" />
              </svg>
            </Link>
          )}
        </nav>
      </div>
    </>





  )
}