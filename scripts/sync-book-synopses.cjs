const { setTimeout: delay } = require("node:timers/promises");
const { books } = require("../src/data/books.ts");
const { readBookSynopsis } = require("../src/data/bookSynopsis.ts");
const { enrichBookFromOpenLibrary } = require("../src/data/openLibrary.ts");

// Refresh in one process before static rendering to respect Open Library's limit.
const fetchRemote = global.fetch;
let lastOpenLibraryRequest = 0;
let requestIssues = new Set();
global.fetch = async (input, options) => {
  const hostname = new URL(input).hostname;
  if (hostname === "openlibrary.org") {
    await delay(Math.max(0, lastOpenLibraryRequest + 1000 - Date.now()));
    lastOpenLibraryRequest = Date.now();
  }
  try {
    const response = await fetchRemote(input, options);
    if (!response.ok) requestIssues.add(`${hostname}: HTTP ${response.status}`);
    return response;
  } catch (error) {
    requestIssues.add(`${hostname}: ${error.message}`);
    throw error;
  }
};

async function main() {
  const catalog = [...new Map(books.map((book) => [book.slug, book])).values()];
  const filter = process.argv.slice(2).find((argument) => argument.startsWith("--slugs="));
  const requested = filter ? new Set(filter.slice("--slugs=".length).split(",").filter(Boolean)) : undefined;
  if (requested) {
    const unknown = [...requested].filter((slug) => !catalog.some((book) => book.slug === slug));
    if (!requested.size || unknown.length) throw new Error(`Invalid --slugs filter: ${unknown.join(", ") || "empty list"}`);
  }
  const selected = catalog.filter((book) => !requested || requested.has(book.slug));
  const unresolved = [];
  let added = 0;
  for (const [index, book] of selected.entries()) {
    const before = await readBookSynopsis(book.slug);
    requestIssues = new Set();
    const enriched = await enrichBookFromOpenLibrary(book);
    const saved = await readBookSynopsis(book.slug);
    let status;
    if (saved) {
      if (!before) added += 1;
      status = before ? "saved synopsis retained" : "new synopsis saved";
      if (before && JSON.stringify(saved) !== JSON.stringify(before)) status = "saved metadata updated";
    } else {
      unresolved.push(book.slug);
      status = enriched.synopsis ? "synopsis found but snapshot not written" : "unresolved: no verified description found";
    }
    console.log(`${index + 1}/${selected.length}: ${book.slug} — ${status}`);
    if (requestIssues.size) console.warn(`  Request issues: ${[...requestIssues].join("; ")}`);
  }
  const onDisk = (await Promise.all(catalog.map((book) => readBookSynopsis(book.slug)))).filter(Boolean).length;
  console.log(`${onDisk}/${catalog.length} catalog books have valid snapshots on disk; ${added} added in this run.`);
  console.log(unresolved.length ? `Unresolved selected books (${unresolved.length}):\n${unresolved.join("\n")}` : "All selected books have saved synopses.");
  console.log("Commit saved snapshots with the book data.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
