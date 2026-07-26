import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { localizeHref } from "@/i18n/client";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPolicyLayoutProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  lastUpdatedLabel: string;
  lastUpdatedValue: string;
  tableOfContentsLabel: string;
  sections: LegalSection[];
  relatedTitle: string;
  relatedDescription: string;
  relatedHref: string;
  relatedLabel: string;
};

export default function LegalPolicyLayout({
  locale,
  eyebrow,
  title,
  description,
  lastUpdatedLabel,
  lastUpdatedValue,
  tableOfContentsLabel,
  sections,
  relatedTitle,
  relatedDescription,
  relatedHref,
  relatedLabel,
}: LegalPolicyLayoutProps) {
  const isIndonesian = locale === "id";

  return (
    <main className="bg-white text-black">
      <section className="relative overflow-hidden bg-[#f4fbf7] px-4 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(3,145,71,0.10),transparent_30%),radial-gradient(circle_at_86%_16%,rgba(3,145,71,0.08),transparent_34%)]" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.04]" />

        <div className="pml-container relative">
          <nav
            className="mb-10 flex flex-wrap items-center gap-2 text-sm font-bold text-black/58"
            aria-label="Breadcrumb"
          >
            <Link
              href={localizeHref("/", locale)}
              className="transition hover:text-[#039147]"
            >
              {isIndonesian ? "Beranda" : "Home"}
            </Link>

            <span>/</span>

            <span className="text-[#039147]">
              {title}
            </span>
          </nav>

          <p className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#039147] shadow-sm">
            {eyebrow}
          </p>

          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[1.06] tracking-tight md:text-7xl">
            {title}
          </h1>

          <p className="mt-7 max-w-3xl text-base font-medium leading-8 text-black/65 md:text-lg">
            {description}
          </p>

          <div className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-black/55 shadow-sm">
            {lastUpdatedLabel}: {lastUpdatedValue}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="pml-container">
          <div className="grid gap-8 lg:grid-cols-[0.34fr_1fr]">

            <aside className="lg:sticky lg:top-28">
              <div className="rounded-[30px] bg-[#f6faf7] p-5 shadow-sm md:p-6">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  {tableOfContentsLabel}
                </p>

                <nav className="mt-5 grid gap-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black/60 transition hover:bg-[#eaf8f0] hover:text-[#039147]"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <article className="rounded-[38px] bg-white p-6 shadow-[0_28px_90px_rgba(3,145,71,0.09)] md:p-10">

              <div className="grid gap-10">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-32 border-b border-black/5 pb-10 last:border-b-0"
                  >

                    <h2 className="text-2xl font-black md:text-3xl">
                      {section.title}
                    </h2>

                    {section.paragraphs?.map((paragraph) => (
                      <div
                        key={paragraph}
                        className="
                          legal-content
                          mt-5
                          text-base
                          font-medium
                          leading-8
                          text-black/65
                        "
                        dangerouslySetInnerHTML={{
                          __html: paragraph,
                        }}
                      />
                    ))}

                    {section.bullets?.length ? (
                      <ul className="mt-5 grid gap-3">
                        {section.bullets.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-base font-medium leading-8 text-black/65"
                          >
                            <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#039147]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                  </section>
                ))}
              </div>


              <div className="mt-12 rounded-[28px] bg-[#eaf8f0] p-6 md:p-8">
                <h2 className="text-2xl font-black">
                  {relatedTitle}
                </h2>

                <p className="mt-3 text-base font-medium leading-8 text-black/60">
                  {relatedDescription}
                </p>

                <Link
                  href={localizeHref(relatedHref, locale)}
                  className="mt-6 inline-flex rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  {relatedLabel}
                </Link>
              </div>

            </article>

          </div>
        </div>
      </section>
    </main>
  );
}
