import Image from "next/image";
import Link from "next/link";

import type { InsightItem } from "@/lib/api";
import { resolveMediaUrl, shouldBypassImageOptimization } from "@/lib/media";

type InsightRelatedProps = {
  items: InsightItem[];
  locale: "en" | "id";
};


export default function InsightRelated({
  items,
  locale,
}: InsightRelatedProps) {

  if (!items.length) {
    return null;
  }


  return (
    <section className="border-t border-black/10 bg-[#fafcfb] py-20">

      <div className="pml-container">


        <div className="mb-12 max-w-3xl">

          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#039147]">
            {locale === "id"
              ? "Artikel Terkait"
              : "Related Insights"}
          </p>


          <h2 className="mt-4 text-3xl font-black leading-tight text-black md:text-5xl">
            {locale === "id"
              ? "Jelajahi wawasan lainnya"
              : "Explore more knowledge"}
          </h2>


          <p className="mt-5 text-base leading-8 text-black/60">
            {locale === "id"
              ? "Pelajari insight lain mengenai layanan CRO, penelitian klinis, dan pengembangan farmasi."
              : "Discover more insights about CRO services, clinical research, and pharmaceutical development."}
          </p>

        </div>



        <div className="grid gap-8 md:grid-cols-3">


          {items.map((item)=>(
            <Link
              key={item.id}
              href={`/${locale}/insight/${item.category}/${item.slug}`}
              className="group overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="relative aspect-[16/10] overflow-hidden">

                <Image
                  src={
                    resolveMediaUrl(item.coverImage) ||
                    "/images/pml/cta-lab-background.png"
                  }
                  alt={item.title}
                  fill
                  unoptimized={shouldBypassImageOptimization(item.coverImage)}
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

              </div>


              <div className="p-7">

                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#039147]">
                  {item.category}
                </p>


                <h3 className="mt-4 text-xl font-black leading-tight text-black group-hover:text-[#039147]">
                  {item.title}
                </h3>


                <p className="mt-4 line-clamp-3 text-sm leading-7 text-black/60">
                  {item.excerpt}
                </p>


                <span className="mt-6 inline-flex text-sm font-black text-[#039147]">
                  {locale === "id"
                    ? "Baca selengkapnya →"
                    : "Read more →"}
                </span>

              </div>


            </Link>
          ))}


        </div>


      </div>


    </section>
  );
}
