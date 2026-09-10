const { setTimeout: delay } = require("node:timers/promises");
const { books } = require("../src/data/books.ts");
const { enrichBookFromOpenLibrary } = require("../src/data/openLibrary.ts");

// Refresh in one process before static rendering to respect Open Library's limit.
const fetchRemote = global.fetch;
let lastOpenLibraryRequest = 0;
global.fetch = async (input, options) => {
  if (new URL(input).hostname === "openlibrary.org") {
    await delay(Math.max(0, lastOpenLibraryRequest + 1000 - Date.now()));
    lastOpenLibraryRequest = Date.now();
  }
  const response = await fetchRemote(input, options);
  if (response.status === 429) {
    console.warn(`${new URL(input).hostname}: request quota reached; keeping saved data.`);
  }
  return response;
};

async function main() {
  const seen = new Set();
  let described = 0;
  for (const book of books) {
    if (seen.has(book.slug)) continue;
    seen.add(book.slug);
    const enriched = await enrichBookFromOpenLibrary(book);
    if (enriched.synopsis) described += 1;
    console.log(`${seen.size}: ${book.slug} — ${enriched.synopsis ? "synopsis saved" : "synopsis unavailable"}`);
  }
  console.log(`${described}/${seen.size} books have synopses. Commit saved snapshots with the book data.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
