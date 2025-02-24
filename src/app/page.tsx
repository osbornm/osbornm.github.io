export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_0fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <div className="flex items-center justify-center p-5">
            <div className="grid md:grid-cols-3 grid-cols-1 items-center md:gap-24">
              <div className="col-span-3 lg:col-span-2 items-center">
                <h1 className="mb-2 text-5xl font-bold text-white">I&apos;m Matthew Osborn</h1>
                <p className="text-white text-xl">
                  I am one of the founders of <a href="https://hyphen.ai" className="font-medium hover:underline">Hyphen</a> where
                  I do engineering and product development. In my previous roles I have led the
                  engineering &amp; product effort across many services you most likely have used such as live
                  streaming (<a href="https://pitchbook.com/profiles/company/52215-22" className="font-medium hover:underline">iStreamPlanet</a>),
                  cloud (<a href="https://www.forbes.com/sites/benkepes/2013/11/19/breaking-centurylink-acquires-tier-3/" className="font-medium hover:underline">Tier3</a>),
                  document management (<a href="https://conga.com" className="font-medium hover:underline">Conga</a>), and renewable
                  energy (<a href="https://palmetto.com" className="font-medium hover:underline">Palmetto</a>). In my early career I worked on ASP.NET
                  for <a href="https://microsoft.com" className="font-medium hover:underline">Microsoft</a>.
                </p>
              </div>
              <div className="hidden lg:flex">
                <img src="https://gravatar.com/avatar/da981fdeee4e1170b90334eac70652d6?size=512" alt="" className="rounded-3xl aspect-square" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


