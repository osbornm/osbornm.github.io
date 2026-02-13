export enum Category {
  Fiction = "Fiction",
  NonFiction = "Non-Fiction",
}

export interface Book {
  title: string;
  year: number;
  category: Category;
  href?: string;
  openLibraryHref?: string;
  author?: string;
  isbn?: string;
  isbn13?: string;
  image?: string;
}
