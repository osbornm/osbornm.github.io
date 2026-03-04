export interface CuratedBookSeriesRef {
  series: string;
}

export type CuratedBookRef = string | CuratedBookSeriesRef;

export interface CuratedBookList {
  slug: string;
  title: string;
  description: string;
  // Use a single ref string (isbn/isbn13/asin/title), "series:<series name>", or { series: "<series name>" }.
  bookRefs: Array<CuratedBookRef>;
}

export const curatedBookLists: Array<CuratedBookList> = [
  {
    slug: "top-10",
    title: "Top 10",
    description:
      "A personal top ten, in no particular order, from books read across years.",
    bookRefs: [
      "9780593723197", // The 5 Types of Wealth: A Transformative Guide to Design Your Dream Life
      { series: "Expeditionary Force" },
      "9780593355275", // Project Hail Mary
      "132410581X", // Going Infinite: The Rise and Fall of a New Tycoon
      "1953953247", // Poor Charlie’s Almanack
      "0525431993", // Bad Blood: Secrets and Lies in a Silicon Valley Startup
      { series: "The Murderbot Diaries" },
      "059380158X", // Source Code My Beginnings
      "9781250276940", // The Fund: Ray Dalio
      "0593654994", // Private Equity: A Memoir
      { series: "Old Man's War" },
    ],
  },
];
