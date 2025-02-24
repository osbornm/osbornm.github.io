export enum Category {
  Fiction = "Fiction",
  NonFiction = "Non-Fiction",
}

export interface Book {
  title: string;
  year: number;
  category: Category;
  href: string;
  image?: string;
}
