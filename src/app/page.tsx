import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  defaultOgImage,
} from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [defaultOgImage],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Matthew Osborn",
  url: SITE_URL,
  image: defaultOgImage.url,
  jobTitle: "Founder",
  worksFor: {
    "@type": "Organization",
    name: "Hyphen",
    url: "https://hyphen.ai",
  },
  sameAs: [
    "https://github.com/osbornm",
    "https://www.linkedin.com/in/osbornm/",
    "https://x.com/osbornm",
    "https://stackoverflow.com/users/5235/matthew-m-osborn",
  ],
};

export default async function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-20 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <main className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-16">
        <div className="space-y-10">
          <header>
            <h1 className="text-5xl font-bold tracking-tight text-white">I&apos;m Matthew Osborn</h1>
            <p className="mt-6 text-xl leading-8 text-white">
              I am one of the founders of{" "}
              <a href="https://hyphen.ai" className="font-medium hover:underline">
                Hyphen
              </a>{" "}
              where I do engineering and product development. In my previous roles I have led the
              engineering &amp; product effort across many services you most likely have used such as live
              streaming (
              <a
                href="https://pitchbook.com/profiles/company/52215-22"
                className="font-medium hover:underline"
              >
                iStreamPlanet
              </a>
              ), cloud (
              <a
                href="https://www.forbes.com/sites/benkepes/2013/11/19/breaking-centurylink-acquires-tier-3/"
                className="font-medium hover:underline"
              >
                Tier3
              </a>
              ), document management (
              <a href="https://conga.com" className="font-medium hover:underline">
                Conga
              </a>
              ), and renewable energy (
              <a href="https://palmetto.com" className="font-medium hover:underline">
                Palmetto
              </a>
              ). In my early career I worked on ASP.NET for{" "}
              <a href="https://microsoft.com" className="font-medium hover:underline">
                Microsoft
              </a>
              .
            </p>
          </header>

          <section aria-labelledby="building-heading">
            <h2 id="building-heading" className="text-2xl font-semibold text-white">
              Building
            </h2>
            <p className="mt-3 text-lg leading-7 text-gray-200">
              Day to day I build product and systems at{" "}
              <a href="https://hyphen.ai" className="font-medium text-white hover:underline">
                Hyphen
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="explore-heading">
            <h2 id="explore-heading" className="text-2xl font-semibold text-white">
              On this site
            </h2>
            <ul className="mt-4 space-y-3 text-lg text-gray-200">
              <li>
                <Link href="/books" className="font-medium text-white hover:underline">
                  Books
                </Link>
                <span className="text-gray-400"> — what I&apos;m reading</span>
              </li>
              <li>
                <Link href="/talks" className="font-medium text-white hover:underline">
                  Talks
                </Link>
                <span className="text-gray-400"> — past presentations and slide decks</span>
              </li>
              <li>
                <Link href="/blog" className="font-medium text-white hover:underline">
                  Blog
                </Link>
                <span className="text-gray-400"> — archival writing</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="hidden justify-self-end lg:block">
          <img
            src="https://gravatar.com/avatar/da981fdeee4e1170b90334eac70652d6?size=512"
            alt="Matthew Osborn"
            width={256}
            height={256}
            className="rounded-3xl aspect-square"
          />
        </div>
      </main>
    </div>
  );
}
