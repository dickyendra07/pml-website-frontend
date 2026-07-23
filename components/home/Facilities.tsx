import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const items = [
  {
    title: "Clinical facilities",
    desc: "70-bed clinical facility with ambulance support for controlled clinical study activities.",
    icon: "bed",
  },
  {
    title: "Analytical facilities",
    desc: "Equipped with LC-MS/MS, GC-FID, GC-MS, ICP-OES, HPLC, and other analytical instruments.",
    icon: "lab",
  },
  {
    title: "Supporting facilities",
    desc: "Drug storage room, archive room, ambulance support, and study operation infrastructure.",
    icon: "document",
  },
  {
    title: "Regulatory-ready documentation",
    desc: "Structured reporting and documentation to support submission readiness.",
    icon: "shield",
  },
];

function Icon({ name }: { name: string }) {
  if (name === "lab") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 3H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 3V8L5.8 17.2C5.1 18.8 6.2 20.5 8 20.5H16C17.8 20.5 18.9 18.8 18.2 17.2L14 8V3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 16H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "bed") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 7V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 12V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 13H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6 10H10.5C12 10 13 11 13 12.5V13H6V10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M4 19H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "document") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 3H14L18 7V21H7V3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 3V7H18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10 12H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 16H14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L19 6V11C19 15.8 16 19.2 12 21C8 19.2 5 15.8 5 11V6L12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15.5 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Facilities() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";
  return (
    <section
      id="facilities"
      className="relative overflow-hidden bg-[#eaf8f0] pb-20 pt-24 md:pb-24 md:pt-32"
    >
      <div className="pml-container">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative min-h-[560px]">
            <div className="absolute -left-10 top-20 h-80 w-80 rounded-full bg-[#039147]/10 blur-3xl" />
            <div className="absolute bottom-10 right-6 h-80 w-80 rounded-full bg-[#ef3124]/10 blur-3xl" />

            <div className="absolute left-10 top-12 hidden h-[430px] w-[560px] rounded-[44px] border border-[#039147]/30 md:block" />
            <div className="absolute left-24 top-28 hidden h-[430px] w-[560px] rounded-[44px] border border-[#ef3124]/25 md:block" />

            <div className="relative z-10 mx-auto flex min-h-[560px] items-center justify-center">
              <Image
                src="/images/pml/facilities/photos/pml-facility-photo-01.png"
                alt="Pharma Metric Labs laboratory facility"
                width={620}
                height={620}
                className="h-auto w-[620px] max-w-full drop-shadow-[0_28px_80px_rgba(0,0,0,0.16)]"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              Facilities & Capability
            </p>

            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-black md:text-5xl">
              Facilities designed to support clinical, analytical, and
              operational needs
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-7 text-black/65">
              PML provides integrated facilities to support reliable CRO project
              delivery, including clinical facilities with 70 beds and ambulance
              support, analytical instruments such as LC-MS/MS, GC-FID, GC-MS,
              ICP-OES, and HPLC, as well as supporting facilities for drug
              storage, archiving, and study operations.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-1">
              {items.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-[20px] border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:rounded-[24px] md:p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#039147] transition group-hover:bg-[#039147] group-hover:text-white md:h-12 md:w-12">
                      <Icon name={item.icon} />
                    </div>

                    <div>
                      <h3 className="text-base font-black leading-tight text-black md:text-xl">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-black/60 md:text-base md:leading-7">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={localizeHref("/facilities", locale)}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#039147] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              {isIndonesian ? "Jelajahi Fasilitas" : "Explore Facilities"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
