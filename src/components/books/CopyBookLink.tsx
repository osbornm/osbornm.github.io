"use client";

import { useId, useState } from "react";

export default function CopyBookLink({ url }: { url: string }) {
  const inputId = useId();
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-gray-100 transition-colors hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
      >
        Copy link
      </button>
      <p role="status" className="text-sm text-gray-300">
        {status === "copied" && "Link copied."}
        {status === "failed" && "Select and copy the link below."}
      </p>
      {status === "failed" && (
        <div>
          <label htmlFor={inputId} className="mb-2 block text-sm text-gray-300">
            Book link
          </label>
          <input
            id={inputId}
            type="url"
            value={url}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
            className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          />
        </div>
      )}
    </div>
  );
}
