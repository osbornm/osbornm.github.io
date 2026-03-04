export enum Category {
  Fiction = "Fiction",
  NonFiction = "Non-Fiction",
}

export interface Book {
  title: string;
  year: number;
  category: Category;
  // Marks entries that should only be used in curated series groupings.
  seriesOnly?: boolean;
  href?: string;
  openLibraryHref?: string;
  author?: string;
  isbn?: string;
  isbn13?: string;
  asin?: string;
  image?: string;
}
