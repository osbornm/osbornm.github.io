'use client';

import Link from "next/link";
import { useEffect } from "react";

export default function ClientRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Moved</h1>
      <p className="mt-4">
        This page moved to{" "}
        <Link href={to} className="underline">
          {to}
        </Link>
        .
      </p>
    </main>
  );
}
