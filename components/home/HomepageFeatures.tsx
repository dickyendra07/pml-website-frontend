"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HomepageFeature, getHomepageFeatures } from "@/lib/api";

function getAssetUrl(value: string | null) {
  if (!value) return "/images/pml/cta-lab-background.png";

  if (value.startsWith("http")) return value;

  if (value.startsWith("/uploads")) {
    const apiOrigin =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
      (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "");

    return `${apiOrigin}${value}`;
  }

  return value;
}

export default function HomepageFeatures() {
  const [items, setItems] = useState<HomepageFeature[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    let isMounted = true;

    async function loadFeatures() {
      try {
        const data = await getHomepageFeatures();

        if (!isMounted) return;

        setItems(data);
        setStatus("success");
      } catch {
        if (!isMounted) return;

        setStatus("error");
      }
    }

    void loadFeatures();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "loading" || status === "error" || items.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="pml-container">
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              Featured Updates
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-black md:text-5xl">
              Highlighted content from PML CMS
            </h2>
          </div>

          <p className="max-w-xl text-base leading-8 text-black/60">
            This section is managed from the admin CMS and can be updated for homepage highlights, CTA campaigns, and selected resources.
          </p>
        </div>

        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {items.map((item) => (
            <article
              key={item.id}
              className="group w-[82vw] max-w-[360px] shrink-0 snap-start overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)] md:w-auto md:max-w-none md:rounded-[34px]"
            >
              <div className="relative h-48 overflow-hidden bg-black md:h-56">
                <Image
                  src={getAssetUrl(item.imageUrl)}
                  alt={item.title}
                  fill
                  unoptimized={Boolean(item.imageUrl?.startsWith("/uploads"))}
                  className="object-cover opacity-90 transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#039147] backdrop-blur">
                  {item.type.replace(/_/g, " ")}
                </div>
              </div>

              <div className="flex min-h-[250px] flex-col p-6 md:p-7">
                <h3 className="text-2xl font-black leading-tight text-black">
                  {item.title}
                </h3>

                {item.description ? (
                  <p className="mt-4 text-base leading-8 text-black/62">
                    {item.description}
                  </p>
                ) : null}

                {item.buttonLabel && item.buttonUrl ? (
                  <Link
                    href={item.buttonUrl}
                    className="mt-auto inline-flex w-fit items-center gap-2 pt-7 text-base font-extrabold text-[#039147]"
                  >
                    {item.buttonLabel}
                    <span className="transition group-hover:translate-x-1">→</span>
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-1 text-center text-xs font-bold text-black/40 md:hidden">
          Swipe to explore featured content
        </p>
      </div>
    </section>
  );
}
