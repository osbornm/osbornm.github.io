'use client';

import { Category } from "@/data/types";
import Link from "next/link";
import { Book } from "@/data/types";
import { Filter } from "./BooksShell";
import { usePathname, useSearchParams } from "next/navigation";

const BooksHeader = ({
  year,
  years,
  books,
  filter,
}: {
  year: number;
  years: Array<number>;
  books: Array<Book>;
  filter: Filter;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = (filterValue: Filter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filterValue === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filterValue);
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const buildYearHref = (selectedYear: number) => {
    const yearPath = `/books/${selectedYear}`;
    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString();
    return query ? `${yearPath}?${query}` : yearPath;
  };

  const currentYear = new Date().getFullYear();
  const getWeeksPassed = () => {
    if (year < currentYear)
      return 52;
    const start = new Date(currentYear, 0, 1);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  };

  const weeksPassed = getWeeksPassed();
  const weeklyAverage = (books.length / weeksPassed).toFixed(2);

  return (
    <>
      <div className="relative isolate overflow-hidden py-20 sm:py-24 pb-10 sm:pb-14">
        <div className="mx-auto px-6 lg:px-20">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">{year} Books</h2>
            <p className="mt-6 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
              Every year I set a goal for myself to consume, read or listen to, one book a week. I believe that it is important to continue to learn and grow and I find reading one of the best ways to do that.
            </p>
          </div>
          <div className="mx-auto mt-5 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="flex flex-wrap items-center justify-between gap-4 text-base/7 font-semibold text-white">
              <div className="flex flex-wrap gap-x-8 gap-y-3 lg:gap-x-10">
                {years.map((y) => (
                  <Link key={y} href={buildYearHref(y)} className={`${year === y ? 'underline font-semibold' : ''} hover:underline`}>
                    {y} <span aria-hidden="true">&rarr;</span>
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-x-5">
                <Link
                  href={buildHref("all")}
                  className={`${filter === "all" ? "underline" : ""} hover:underline`}
                >
                  All
                </Link>
                <Link
                  href={buildHref("fiction")}
                  className={`${filter === "fiction" ? "underline" : ""} hover:underline`}
                >
                  Fiction
                </Link>
                <Link
                  href={buildHref("nonfiction")}
                  className={`${filter === "nonfiction" ? "underline" : ""} hover:underline`}
                >
                  Non-Fiction
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block mx-auto mt-5 max-w-2xl lg:mx-0 lg:max-w-none">
            <dl className=" grid grid-cols-1 gap-8 sm:mt-10 sm:grid-cols-4 lg:grid-cols-4">
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-gray-300">Total</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">{books.length}</dd>
              </div>

              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-gray-300">Non-Fiction</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">{books.filter(b => b.category === Category.NonFiction).length}</dd>
              </div>

              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-gray-300">Fiction</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">{books.filter(b => b.category === Category.Fiction).length}</dd>
              </div>

              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-gray-300">Books per Week</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">{weeklyAverage}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}

export default BooksHeader;
