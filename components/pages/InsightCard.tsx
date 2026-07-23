import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { InsightItem as StaticInsightItem } from "@/data/insights";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";
import { InsightItem as ApiInsightItem } from "@/lib/api";

type InsightCardItem = StaticInsightItem | ApiInsightItem;

type InsightCardProps = {
  item: InsightCardItem;
  featured?: boolean;
};

const categoryLabelEn: Record<string, string> = {
  articles: "Article",
  news: "News",
  publications: "Publication",
  faq: "FAQ",
};

const categoryLabelId: Record<string, string> = {
  articles: "Artikel",
  news: "Berita",
  publications: "Publikasi",
  faq: "FAQ",
};

function getAssetUrl(value: string | null | undefined) {
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

function getImage(item: InsightCardItem) {
  if ("image" in item) return item.image;

  return getAssetUrl(item.coverImage);
}

function getExcerpt(item: InsightCardItem) {
  return item.excerpt || "";
}

function getDate(item: InsightCardItem, locale: "en" | "id") {
  if ("date" in item) return item.date;

  const value = item.publishedAt || item.createdAt;

  if (!value) return "PML Insight";

  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

function getReadTime(item: InsightCardItem, isIndonesian: boolean) {
  if ("readTime" in item) return item.readTime;

  const source = item.content || item.excerpt || "";
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));

  return isIndonesian ? `${minutes} menit baca` : `${minutes} min read`;
}

export default function InsightCard({
  item,
  featured = false,
}: InsightCardProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const category = item.category;
  const image = getImage(item);
  const categoryLabels = isIndonesian ? categoryLabelId : categoryLabelEn;
  const isUploadImage =
    image.startsWith("http://localhost") || image.includes("/uploads/");

  return (
    <article
      className={`group overflow-hidden border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(0,0,0,0.12)] ${
        featured
          ? "rounded-[30px] md:rounded-[38px]"
          : "w-[82vw] max-w-[340px] shrink-0 snap-start rounded-[28px] md:w-auto md:max-w-none md:rounded-[32px]"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-black ${featured ? "aspect-[16/10] md:aspect-[16/8.5]" : "aspect-[16/10]"}`}
      >
        <Image
          src={image}
          alt={item.title}
          fill
          unoptimized={isUploadImage}
          className="object-cover opacity-90 transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent" />

        <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-white/12 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur">
          {categoryLabels[category] || "Insight"}
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#039147] backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={featured ? "p-6 md:p-10" : "p-6 md:p-7"}>
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-black/40">
          <span>{getDate(item, locale)}</span>
          <span className="h-1 w-1 rounded-full bg-black/20" />
          <span>{getReadTime(item, isIndonesian)}</span>
        </div>

        <h3
          className={`${featured ? "mt-4 text-2xl md:mt-5 md:text-4xl" : "mt-4 text-xl md:text-2xl"} font-black leading-tight text-black transition group-hover:text-[#039147]`}
        >
          {item.title}
        </h3>

        <p
          className={`${featured ? "mt-4 text-base leading-8 md:mt-5 md:text-lg md:leading-9" : "mt-3 text-base leading-7 md:mt-4 md:leading-8"} text-black/60`}
        >
          {getExcerpt(item)}
        </p>

        <Link
          href={localizeHref(`/insight/${category}`, locale)}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#eaf8f0] px-5 py-3 text-sm font-extrabold text-[#039147] transition group-hover:bg-[#039147] group-hover:text-white"
        >
          {isIndonesian ? "Baca selengkapnya" : "Read more"}
          <span className="transition group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
