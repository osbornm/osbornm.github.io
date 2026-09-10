This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Book pages

Every entry in `src/data/books.ts` has a permanent `slug` used at
`https://osbornm.com/books/<slug>`. Keep that slug when changing a title, and reuse
it when recording another reading of the same book. Reserve numeric slugs and
`all`, `collections`, and `lists` for the existing bookshelf routes.

`npm run build` refreshes book assets in one sequential process before generating
the static site. It fetches missing Google Books synopses, with Open Library as a
fallback, and saves them under `src/data/book-synopses/`. Open Library requests
are spaced one second apart. Commit those JSON files alongside book changes so the
offline `npm run build:ci` deployment includes the descriptions. Each snapshot
contains plain text, `sourceUrl`, `author`, and an optional `sourceName` displayed
with the attribution. Saved descriptions are retained when a lookup fails.

Run `npm run books:sync` to fetch missing synopses without refreshing existing
covers, or `npm run books:sync -- --slugs=slug-one,slug-two` to retry selected
books. The report distinguishes new and retained snapshots, lists unresolved
books and request errors, and counts valid snapshots on disk.

The importer tries the ISBN first, then the title with a verified author. It
checks duplicate works and English editions when a matching record has no
description. Verify missing authors and incorrect ISBNs in `books.ts` before
retrying; matching never substitutes a different author to fill a gap. If the
services have no description, add a short original synopsis grounded in the
author's or publisher's book page, with its URL and name as the source. Keep
these curated snapshots when rerunning the import. New books without a verified
description remain usable and display “Synopsis unavailable.”

Run `npm test` for book identity, synopsis, and offline enrichment checks.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
