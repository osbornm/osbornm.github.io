const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { after, before, test } = require("node:test");
const {
  readBookSynopsis,
  matchesBookTitleAndAuthor,
  selectGoogleBooksVolume,
  synopsisFromDescription,
  synopsisFromGoogleVolume,
  writeBookSynopsis,
} = require("../src/data/bookSynopsis.ts");

const originalCwd = process.cwd();
const originalFetch = global.fetch;
let fixture;
const book = { slug: "a-book", title: "A Book", author: "Jane Doe", year: 2026, category: "Fiction" };
const synopsis = { text: "A saved synopsis.", sourceUrl: "https://books.google.com/books?id=saved" };
const volume = (id, details = {}) => ({
  id,
  volumeInfo: { title: "A Book", authors: ["Jane Doe"], description: "<p>A fresh synopsis.</p>", ...details },
});

function loadEnrichment({ remote = "1", write = "0", covers = "0" } = {}) {
  process.env.BOOK_REMOTE_ENRICHMENT = remote;
  process.env.BOOK_SYNOPSIS_WRITE = write;
  process.env.BOOK_COVER_WRITE = covers;
  delete require.cache[require.resolve("../src/data/openLibrary.ts")];
  return require("../src/data/openLibrary.ts").enrichBookFromOpenLibrary;
}

before(async () => {
  fixture = await fs.mkdtemp(path.join(os.tmpdir(), "book-synopsis-test-"));
  await fs.mkdir(path.join(fixture, "public/img/book-covers"), { recursive: true });
  await fs.writeFile(path.join(fixture, "public/img/book-covers/title-a-book-123.jpg"), "cover");
  process.chdir(fixture);
});

after(async () => {
  process.chdir(originalCwd);
  global.fetch = originalFetch;
  await fs.rm(fixture, { recursive: true, force: true });
});

test("converts HTML descriptions to readable text with entities and paragraphs", () => {
  const result = synopsisFromGoogleVolume(volume("a/b", {
    description: '<p>A &amp; B <b>bold</b> &ldquo;quoted&rdquo; &#x1F680;</p><p>Next<br>line <a href="https://example.com">link</a></p><script>alert(1)</script><style>hidden</style><img src="x">',
  }));
  assert.equal(result.text, "A & B bold “quoted” 🚀\n\nNext\nline link");
  assert.equal(result.sourceUrl, "https://books.google.com/books?id=a%2Fb");
  assert.equal(result.author, "Jane Doe");
  assert.equal(synopsisFromGoogleVolume(volume("empty", { description: "<p> </p>" })), undefined);
  assert.equal(synopsisFromGoogleVolume(volume("missing", { description: undefined })), undefined);
});

test("converts Markdown emphasis, links, and escaped paragraph separators to plain text", () => {
  const result = synopsisFromDescription(
    '**Murderbot returns.** Read [the book](https://example.com).\\ \\ A new _adventure_ awaits.',
    "https://openlibrary.org/works/OL20735675W",
    "Martha Wells",
  );
  assert.deepEqual(result, {
    text: "Murderbot returns. Read the book.\n\nA new adventure awaits.",
    sourceUrl: "https://openlibrary.org/works/OL20735675W",
    author: "Martha Wells",
  });
});

test("requires matching ISBN and accepts its equivalent 13-digit identifier", () => {
  const matching = volume("isbn", { industryIdentifiers: [{ identifier: "9780593135204" }] });
  const wrong = volume("wrong", { industryIdentifiers: [{ identifier: "9780593135205" }] });
  const byIsbn = { ...book, isbn: "0-593-13520-2" };
  assert.equal(selectGoogleBooksVolume(byIsbn, [wrong, matching]), matching);
  assert.equal(selectGoogleBooksVolume(byIsbn, [wrong, volume("missing-isbn")]), undefined);
});

test("matches normalized title and known author while rejecting ambiguous authors", () => {
  const matching = volume("correct", { title: "A Book: A Novel" });
  const wrongAuthor = volume("other", { authors: ["John Smith"] });
  assert.equal(selectGoogleBooksVolume(book, [wrongAuthor, matching]), matching);
  assert.equal(selectGoogleBooksVolume({ ...book, author: undefined }, [wrongAuthor, volume("matching-title")]), undefined);
  assert.equal(selectGoogleBooksVolume(book, [volume("other-title", { title: "A Different Book" })]), undefined);
  assert.equal(selectGoogleBooksVolume(book, [volume("no-author", { authors: undefined })]), undefined);
});

test("unknown authors require the full title including series or subtitle", () => {
  const renegades = { ...book, title: "Renegades: Expeditionary Force, Book 7", author: undefined };
  const unrelated = volume("unrelated", { title: "Renegades", authors: ["Marissa Meyer"] });
  const correct = volume("correct", { title: "Renegades", subtitle: "Expeditionary Force, Book 7", authors: ["Craig Alanson"] });
  assert.equal(selectGoogleBooksVolume(renegades, [unrelated]), undefined);
  assert.equal(selectGoogleBooksVolume(renegades, [unrelated, correct]), correct);
  assert.equal(matchesBookTitleAndAuthor(renegades, "Renegades", ["Marissa Meyer"]), false);
  assert.equal(matchesBookTitleAndAuthor(renegades, renegades.title, ["Craig Alanson"]), true);
  assert.equal(selectGoogleBooksVolume({ ...book, author: undefined }, [volume("exact-title")])?.id, "exact-title");
});

test("accepts duplicate editions of the same work and prefers an available description", () => {
  const described = volume("described");
  assert.equal(selectGoogleBooksVolume(book, [volume("empty", { description: undefined }), described]), described);
  const coauthored = volume("coauthored", { authors: ["Jane Doe", "John Smith"] });
  assert.equal(selectGoogleBooksVolume({ ...book, author: "Jane Doe, John Smith" }, [coauthored]), coauthored);
});

test("concurrent snapshot writes leave one complete JSON file and no temporary files", async () => {
  await Promise.all([
    writeBookSynopsis("atomic", synopsis),
    writeBookSynopsis("atomic", { ...synopsis, text: "Another complete synopsis." }),
  ]);
  const saved = await readBookSynopsis("atomic");
  assert.ok([synopsis.text, "Another complete synopsis."].includes(saved.text));
  const files = await fs.readdir(path.join(fixture, "src/data/book-synopses"));
  assert.deepEqual(files.filter((file) => file.startsWith("atomic")), ["atomic.json"]);
  await fs.writeFile(path.join(fixture, "src/data/book-synopses/broken.json"), "invalid JSON");
  assert.equal(await readBookSynopsis("broken"), undefined);
  assert.equal(await readBookSynopsis("absent"), undefined);
});

test("offline enrichment loads saved synopsis and discovered local cover without network", async () => {
  await writeBookSynopsis(book.slug, synopsis);
  global.fetch = async () => { assert.fail("offline enrichment must not fetch"); };
  const enrich = loadEnrichment({ remote: "0", write: "1", covers: "1" });
  const result = await enrich(book);
  assert.deepEqual(result.synopsis, synopsis);
  assert.equal(result.image, "/img/book-covers/title-a-book-123.jpg");
});

test("a local cover with cached synopsis skips remote lookup", async () => {
  global.fetch = async () => { assert.fail("cached synopsis and cover must not fetch"); };
  const enrich = loadEnrichment({ write: "1" });
  assert.deepEqual((await enrich(book)).synopsis, synopsis);
});

test("synopsis writing enriches books with local covers and reuses saved results", async () => {
  const uncached = { ...book, slug: "fresh" };
  let calls = 0;
  global.fetch = async (url, options) => {
    calls += 1;
    assert.ok(url.startsWith("https://www.googleapis.com/books/v1/volumes?"));
    assert.ok(new URL(url).searchParams.get("q").includes("inauthor:Jane Doe"));
    assert.ok(options.signal instanceof AbortSignal);
    return new Response(JSON.stringify({ items: [volume("fresh")] }));
  };
  const enrich = loadEnrichment({ write: "1" });
  const result = await enrich(uncached);
  assert.equal(result.image, "/img/book-covers/title-a-book-123.jpg");
  assert.equal(result.synopsis.text, "A fresh synopsis.");
  assert.deepEqual(await readBookSynopsis(uncached.slug), result.synopsis);
  assert.deepEqual((await enrich(uncached)).synopsis, result.synopsis);
  assert.equal(calls, 1);
});

test("a failed lookup preserves the loaded synopsis and existing image", async () => {
  global.fetch = async () => { throw new Error("network timeout"); };
  const enrich = loadEnrichment({ covers: "1" });
  const result = await enrich(book);
  assert.deepEqual(result.synopsis, synopsis);
  assert.equal(result.image, "/img/book-covers/title-a-book-123.jpg");
});

test("missing descriptions and unsuccessful responses leave local books usable", async () => {
  const enrich = loadEnrichment({ write: "1" });
  for (const response of [
    new Response(JSON.stringify({ items: [volume("empty", { description: undefined })] })),
    new Response("Unavailable", { status: 503 }),
  ]) {
    global.fetch = async () => response;
    const result = await enrich({ ...book, slug: "unavailable" });
    assert.equal(result.synopsis, undefined);
    assert.equal(result.image, "/img/book-covers/title-a-book-123.jpg");
    assert.equal(await readBookSynopsis("unavailable"), undefined);
  }
});

test("missing Google descriptions fall back to an ISBN edition description", async () => {
  global.fetch = async (url, options) => {
    assert.ok(options.signal instanceof AbortSignal);
    if (url.includes("googleapis.com")) return new Response(JSON.stringify({ items: [] }));
    assert.equal(url, "https://openlibrary.org/isbn/9780593135204.json");
    return new Response(JSON.stringify({ description: "<p>An edition &amp; its story.</p>" }));
  };
  const enrich = loadEnrichment({ write: "1" });
  const result = await enrich({ ...book, slug: "edition", isbn13: "9780593135204", image: "/img/existing.jpg" });
  assert.deepEqual(result.synopsis, {
    text: "An edition & its story.",
    sourceUrl: "https://openlibrary.org/isbn/9780593135204",
    author: "Jane Doe",
  });
  assert.deepEqual(await readBookSynopsis("edition"), result.synopsis);
  assert.equal(result.image, "/img/existing.jpg");
});

test("a Google request failure still permits a work description fallback", async () => {
  global.fetch = async (url) => {
    if (url.includes("googleapis.com")) throw new Error("Google unavailable");
    if (url.includes("/isbn/")) {
      return new Response(JSON.stringify({ works: [{ key: "/works/OL123W" }] }));
    }
    assert.equal(url, "https://openlibrary.org/works/OL123W.json");
    return new Response(JSON.stringify({ description: { value: "A work synopsis." } }));
  };
  const result = await loadEnrichment({ write: "1" })({
    ...book, slug: "work-fallback", isbn13: "9780593135204", image: "/img/existing.jpg",
  });
  assert.deepEqual(result.synopsis, { text: "A work synopsis.", sourceUrl: "https://openlibrary.org/works/OL123W", author: "Jane Doe" });
});

test("translated ISBN editions use the linked work instead of a foreign-language synopsis", async () => {
  global.fetch = async (url) => {
    if (url.includes("googleapis.com")) return new Response(JSON.stringify({ items: [] }));
    if (url.includes("/isbn/")) {
      return new Response(JSON.stringify({
        description: "Това е българско описание.",
        languages: [{ key: "/languages/bul" }],
        works: [{ key: "/works/OL123W" }],
      }));
    }
    assert.equal(url, "https://openlibrary.org/works/OL123W.json");
    return new Response(JSON.stringify({ description: "An English work synopsis." }));
  };
  const result = await loadEnrichment({ write: "1" })({
    ...book, slug: "translated-edition", isbn13: "9780593135204", image: "/img/existing.jpg",
  });
  assert.deepEqual(result.synopsis, {
    text: "An English work synopsis.", sourceUrl: "https://openlibrary.org/works/OL123W", author: "Jane Doe",
  });
});

test("translated editions without a linked work leave the synopsis unavailable", async () => {
  global.fetch = async (url) => {
    if (url.includes("googleapis.com")) return new Response(JSON.stringify({ items: [] }));
    assert.ok(url.includes("/isbn/"));
    return new Response(JSON.stringify({
      description: "Това е българско описание.", languages: [{ key: "/languages/bul" }],
    }));
  };
  const result = await loadEnrichment({ write: "1" })({
    ...book, slug: "translated-without-work", isbn13: "9780593135204", image: "/img/existing.jpg",
  });
  assert.equal(result.synopsis, undefined);
  assert.equal(await readBookSynopsis("translated-without-work"), undefined);
});

test("title fallback selects a unique work matching the known author", async () => {
  global.fetch = async (url) => {
    if (url.includes("googleapis.com")) return new Response("unavailable", { status: 503 });
    if (url.includes("/search.json")) {
      assert.equal(new URL(url).searchParams.get("author"), "Jane Doe");
      return new Response(JSON.stringify({ docs: [
        { key: "/works/OL1W", title: "A Book", author_name: ["Another Author"] },
        { key: "/works/OL2W", title: "A Book", author_name: ["Jane Doe"] },
      ] }));
    }
    assert.equal(url, "https://openlibrary.org/works/OL2W.json");
    return new Response(JSON.stringify({ description: "The matching book." }));
  };
  const result = await loadEnrichment({ write: "1" })({ ...book, slug: "title-fallback" });
  assert.deepEqual(result.synopsis, { text: "The matching book.", sourceUrl: "https://openlibrary.org/works/OL2W", author: "Jane Doe" });
});

test("ambiguous Open Library works are omitted instead of selecting the first", async () => {
  global.fetch = async (url) => {
    if (url.includes("googleapis.com")) return new Response(JSON.stringify({ items: [] }));
    assert.ok(url.includes("/search.json"));
    return new Response(JSON.stringify({ docs: [
      { key: "/works/OL1W", title: "A Book", author_name: ["Jane Doe"] },
      { key: "/works/OL2W", title: "A Book", author_name: ["Jane Doe"] },
    ] }));
  };
  const result = await loadEnrichment({ write: "1" })({ ...book, slug: "ambiguous" });
  assert.equal(result.synopsis, undefined);
  assert.equal(result.image, "/img/book-covers/title-a-book-123.jpg");
});

test("Open Library cannot substitute an unrelated base title when the author is unknown", async () => {
  const title = "Renegades: Expeditionary Force, Book 7";
  global.fetch = async (url) => {
    if (url.includes("googleapis.com")) return new Response(JSON.stringify({ items: [] }));
    assert.ok(url.includes("/search.json"));
    assert.equal(new URL(url).searchParams.get("title"), title);
    return new Response(JSON.stringify({ docs: [
      { key: "/works/OL17867102W", title: "Renegades", author_name: ["Marissa Meyer"] },
    ] }));
  };
  const result = await loadEnrichment({ write: "1" })({
    ...book, title, slug: "unrelated-renegades", author: undefined, image: "/img/existing.jpg",
  });
  assert.equal(result.synopsis, undefined);
  assert.equal(await readBookSynopsis("unrelated-renegades"), undefined);
});

test("Google quota exhaustion stops further Google requests while keeping fallback available", async () => {
  let googleCalls = 0;
  global.fetch = async (url) => {
    if (url.includes("googleapis.com")) {
      googleCalls += 1;
      return new Response("quota exhausted", { status: 429 });
    }
    assert.ok(url.includes("/isbn/"));
    return new Response(JSON.stringify({ description: "An available fallback." }));
  };
  const enrich = loadEnrichment({ write: "1" });
  for (const slug of ["quota-one", "quota-two"]) {
    const result = await enrich({ ...book, slug, isbn13: "9780593135204", image: "/img/existing.jpg" });
    assert.equal(result.synopsis.text, "An available fallback.");
  }
  assert.equal(googleCalls, 1);
});

test("unavailable fallback requests retain the existing cover without writing a snapshot", async () => {
  global.fetch = async () => { throw new Error("Both providers unavailable"); };
  const result = await loadEnrichment({ write: "1" })({ ...book, slug: "both-unavailable" });
  assert.equal(result.synopsis, undefined);
  assert.equal(result.image, "/img/book-covers/title-a-book-123.jpg");
  assert.equal(await readBookSynopsis("both-unavailable"), undefined);
});

test("offline pages use saved authors while retaining explicit catalog authors", async () => {
  const saved = { ...synopsis, author: "Saved Author" };
  await writeBookSynopsis("saved-author", saved);
  global.fetch = async () => { assert.fail("offline metadata must not fetch"); };
  const enrich = loadEnrichment({ remote: "0" });
  const result = await enrich({ ...book, slug: "saved-author", author: undefined });
  assert.equal(result.author, "Saved Author");
  assert.deepEqual(result.synopsis, saved);
  assert.equal((await enrich({ ...book, slug: "saved-author" })).author, "Jane Doe");
});

test("author refresh augments an existing synopsis without replacing its text or source", async () => {
  await writeBookSynopsis("author-refresh", synopsis);
  global.fetch = async (url) => {
    if (url.includes("googleapis.com")) return new Response("quota exhausted", { status: 429 });
    assert.ok(url.startsWith("https://openlibrary.org/api/books?"));
    return new Response(JSON.stringify({
      "ISBN:9780593135204": { authors: [{ name: "Jane Doe" }, { name: "John Smith" }] },
    }));
  };
  const result = await loadEnrichment({ write: "1" })({
    ...book, slug: "author-refresh", author: undefined, isbn13: "9780593135204", image: "/img/existing.jpg",
  });
  assert.equal(result.author, "Jane Doe, John Smith");
  assert.deepEqual(result.synopsis, { ...synopsis, author: "Jane Doe, John Smith" });
  assert.deepEqual(await readBookSynopsis("author-refresh"), result.synopsis);
});

test("new Open Library ISBN synopses persist resolved author names for offline pages", async () => {
  global.fetch = async (url) => {
    if (url.includes("googleapis.com")) return new Response(JSON.stringify({ items: [] }));
    if (url.includes("/api/books?")) {
      return new Response(JSON.stringify({ "ISBN:9780593135204": { authors: [{ name: "Jane Doe" }] } }));
    }
    assert.equal(url, "https://openlibrary.org/isbn/9780593135204.json");
    return new Response(JSON.stringify({ description: "An attributed edition." }));
  };
  const result = await loadEnrichment({ write: "1" })({
    ...book, slug: "resolved-author", author: undefined, isbn13: "9780593135204", image: "/img/existing.jpg",
  });
  assert.equal(result.author, "Jane Doe");
  assert.deepEqual(await readBookSynopsis("resolved-author"), {
    text: "An attributed edition.", sourceUrl: "https://openlibrary.org/isbn/9780593135204", author: "Jane Doe",
  });
});

test("matched Google author metadata can complete a saved synopsis without a fresh description", async () => {
  await writeBookSynopsis("google-author", synopsis);
  global.fetch = async (url) => {
    assert.ok(url.includes("googleapis.com"));
    return new Response(JSON.stringify({ items: [volume("author-only", { description: undefined })] }));
  };
  const result = await loadEnrichment({ write: "1" })({ ...book, slug: "google-author", author: undefined });
  assert.equal(result.author, "Jane Doe");
  assert.deepEqual(result.synopsis, { ...synopsis, author: "Jane Doe" });
});

test("failed author refresh preserves the exact saved synopsis", async () => {
  await writeBookSynopsis("unavailable-author", synopsis);
  global.fetch = async () => { throw new Error("unavailable author metadata"); };
  const result = await loadEnrichment({ write: "1" })({
    ...book, slug: "unavailable-author", author: undefined, isbn13: "9780593135204", image: "/img/existing.jpg",
  });
  assert.deepEqual(result.synopsis, synopsis);
  assert.deepEqual(await readBookSynopsis("unavailable-author"), synopsis);
  assert.equal(result.author, undefined);
});
