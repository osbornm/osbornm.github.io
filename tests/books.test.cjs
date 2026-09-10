const assert = require("node:assert/strict");
const { test } = require("node:test");

process.env.BOOK_REMOTE_ENRICHMENT = "0";
const { books } = require("../src/data/books.ts");
const shelf = require("../src/data/bookService.ts").default;

test("every reading has a permanent, nonreserved slug; only rereads share one", () => {
  const seen = new Map();
  for (const book of books) {
    assert.match(book.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!/^[0-9]+$/.test(book.slug));
    assert.ok(!["all", "collections", "lists"].includes(book.slug));
    const id = (book.isbn13 ?? book.isbn ?? book.asin ?? book.title)
      .replace(/[^a-z0-9]/gi, "").toLowerCase();
    if (seen.has(book.slug)) assert.equal(id, seen.get(book.slug));
    seen.set(book.slug, id);
  }
  assert.equal(shelf.getBookSlugs().length, seen.size);
});

test("a reread resolves to one page containing both reading years", async () => {
  const detail = await shelf.getBookWithOpenLibrary("12-months-to-1-million");
  assert.ok(detail);
  assert.deepEqual(detail.yearsRead, [2025, 2024]);
  assert.equal(detail.book.title, "12 Months to $1 Million");
});

test("series-only books have pages without affecting yearly lists", async () => {
  const book = books.find((book) => book.seriesOnly);
  assert.ok(shelf.getBookSlugs().includes(book.slug));
  assert.equal((await shelf.getBookWithOpenLibrary(book.slug)).book.slug, book.slug);
  const visibleBooks = await shelf.getAllWithOpenLibrary();
  assert.equal(visibleBooks.length, books.filter((book) => !book.seriesOnly).length);
  assert.ok(visibleBooks.every((book) => !book.seriesOnly));
  assert.deepEqual(shelf.getYearList(), [2026, 2025, 2024, 2023]);
});

test("unknown and year-like book slugs do not resolve", async () => {
  for (const slug of ["unknown-book", "2026-extra", "9999"]) {
    assert.equal(await shelf.getBookWithOpenLibrary(slug), undefined);
  }
});
