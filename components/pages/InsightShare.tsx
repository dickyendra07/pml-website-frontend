"use client";

import { useState } from "react";

type InsightShareProps = {
  locale: "en" | "id";
};

export default function InsightShare({
  locale,
}: InsightShareProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(
      window.location.href,
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function shareLinkedIn() {
    const url = encodeURIComponent(
      window.location.href,
    );

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="rounded-[30px] border border-black/5 bg-white p-7 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
        {locale === "id"
          ? "Bagikan Artikel"
          : "Share Article"}
      </p>

      <div className="mt-5 flex gap-3">
        <button
          onClick={copyLink}
          className="rounded-full bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-[#039147]"
        >
          {copied
            ? locale === "id"
              ? "Tersalin"
              : "Copied"
            : "Copy Link"}
        </button>

        <button
          onClick={shareLinkedIn}
          className="rounded-full bg-[#039147] px-5 py-3 text-sm font-black text-white transition hover:bg-black"
        >
          LinkedIn
        </button>
      </div>
    </div>
  );
}
