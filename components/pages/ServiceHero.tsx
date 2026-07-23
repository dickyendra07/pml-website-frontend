"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

type ServiceHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

export default function ServiceHero({
  eyebrow,
  title,
  description,
  image,
}: ServiceHeroProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  return (
    <section className="relative overflow-hidden bg-black">
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover opacity-75"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/72 to-black/25" />
      <div className="pml-hex-pattern absolute inset-0 opacity-[0.12]" />

      <div className="pml-container relative z-10 grid min-h-[680px] items-center py-24">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black/70 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#039147]" />
            {eyebrow}
          </div>

          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white md:text-7xl">
            {title}
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-8 text-white/72 md:text-lg">
            {description}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openProposal}
              className="inline-flex h-13 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-[#039147] transition hover:-translate-y-0.5"
            >
              {isIndonesian ? "Ajukan Proposal" : "Request a Proposal"}
            </button>

            <Link
              href={localizeHref("/services", locale)}
              className="inline-flex h-13 items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              {isIndonesian ? "Jelajahi Layanan" : "Explore Services"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
