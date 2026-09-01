"use client";

import { useRef } from "react";

import MediaImage from "@/components/MediaImage";
import type { Locale } from "@/i18n/config";
import type { CareerDocumentationItem } from "@/lib/api";

type CareerDocumentationGalleryProps = {
  items: CareerDocumentationItem[];
  locale: Locale;
};

function formatDate(value: string | null, locale: Locale) {
  if (!value) return null;

  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function CareerDocumentationGallery({
  items,
  locale,
}: CareerDocumentationGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isIndonesian = locale === "id";
  const visibleItems = items.filter(
    (item): item is CareerDocumentationItem & { image: string } =>
      typeof item.image === "string" && item.image.length > 0,
  );

  if (visibleItems.length === 0) return null;

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.max(300, track.clientWidth * 0.82),
      behavior: "smooth",
    });
  };

  return (
    <section className="overflow-hidden bg-white px-4 py-16 md:py-24">
      <div className="pml-container">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              {isIndonesian ? "Perjalanan Karier" : "Inside PML Careers"}
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {isIndonesian
                ? "Mengenal Proses Karier di PML"
                : "Inside the PML Career Journey"}
            </h2>
            <p className="mt-5 text-[17px] font-medium leading-8 text-black/62 md:text-lg">
              {isIndonesian
                ? "Dokumentasi proses rekrutmen, wawancara, assessment, dan berbagai aktivitas yang membentuk pengalaman kandidat di Pharma Metric Labs."
                : "A closer look at recruitment, interviews, assessment activities, and moments that shape the candidate experience at Pharma Metric Labs."}
            </p>
          </div>

          <div className="hidden gap-3 md:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label={
                isIndonesian
                  ? "Lihat dokumentasi sebelumnya"
                  : "View previous documentation"
              }
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#039147]/20 bg-white text-xl font-black text-[#039147] shadow-sm transition hover:bg-[#039147] hover:text-white"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label={
                isIndonesian
                  ? "Lihat dokumentasi berikutnya"
                  : "View next documentation"
              }
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#039147] text-xl font-black text-white shadow-[0_16px_40px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visibleItems.map((item) => {
            const date = formatDate(item.documentationDate, locale);
            const alt =
              item.media?.altText || item.media?.title || item.title;

            return (
              <article
                key={item.id}
                className="group min-w-[86%] snap-start overflow-hidden rounded-[30px] border border-[#039147]/10 bg-[#f7fbf8] shadow-[0_22px_65px_rgba(3,145,71,0.09)] sm:min-w-[48%] xl:min-w-[32%]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#eaf8f0]">
                  <MediaImage
                    src={item.image}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 86vw, (max-width: 1280px) 48vw, 32vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.035]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#039147] shadow-sm backdrop-blur">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 md:p-6">
                  <h3 className="text-2xl font-black leading-tight text-black">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="mt-3 line-clamp-3 text-sm font-medium leading-7 text-black/60">
                      {item.description}
                    </p>
                  ) : null}
                  {date ? (
                    <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-black/38">
                      {date}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-1 text-center text-xs font-bold text-black/38 md:hidden">
          {isIndonesian
            ? "Geser untuk melihat dokumentasi"
            : "Swipe to explore documentation"}
        </p>
      </div>
    </section>
  );
}
