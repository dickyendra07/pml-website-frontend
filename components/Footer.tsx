"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  fallbackPublicSettings,
  getPublicSettings,
  getSettingValue,
  PublicSettings,
} from "@/lib/public-settings";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black/78 transition hover:border-[#039147] hover:bg-[#039147] hover:text-white"
    >
      {children}
    </a>
  );
}

const englishPageLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Services", href: "/services" },
  { label: "Facilities", href: "/facilities" },
  { label: "Insight", href: "/insight" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const englishServiceLinks = [
  { label: "Contract Analysis", href: "/services/contract-analysis" },
  { label: "BA/BE Study", href: "/services/babe-studies" },
  { label: "Clinical Trial", href: "/services/clinical-trial" },
  { label: "Regulatory Management", href: "/services/regulatory-consultation" },
];

const indonesianPageLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/about-us" },
  { label: "Layanan", href: "/services" },
  { label: "Fasilitas", href: "/facilities" },
  { label: "Wawasan", href: "/insight" },
  { label: "Karier", href: "/careers" },
  { label: "Kontak", href: "/contact" },
];

const indonesianServiceLinks = [
  { label: "Analisis Kontrak", href: "/services/contract-analysis" },
  { label: "Studi BA/BE", href: "/services/babe-studies" },
  { label: "Uji Klinis", href: "/services/clinical-trial" },
  {
    label: "Manajemen Regulasi",
    href: "/services/regulatory-consultation",
  },
];

export default function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";
  const pageLinks = isIndonesian ? indonesianPageLinks : englishPageLinks;
  const serviceLinks = isIndonesian
    ? indonesianServiceLinks
    : englishServiceLinks;

  const [settings, setSettings] = useState<PublicSettings>(
    fallbackPublicSettings,
  );

  useEffect(() => {
    getPublicSettings()
      .then((data) => {
        setSettings({
          ...fallbackPublicSettings,
          ...data,
        });
      })
      .catch(() => {
        setSettings(fallbackPublicSettings);
      });
  }, []);

  const companyName = getSettingValue(settings, "company.name", "PML");
  const englishCompanyDescription = getSettingValue(
    settings,
    "company.description",
    getSettingValue(fallbackPublicSettings, "company.description"),
  );

  const companyDescription = isIndonesian
    ? "Pharma Metric Labs mendukung perusahaan farmasi dan bioteknologi melalui layanan CRO ilmiah untuk studi BA/BE, uji klinis, analisis kontrak, dan manajemen regulasi."
    : englishCompanyDescription;
  const email = getSettingValue(
    settings,
    "contact.email",
    "info@pharmametriclabs.com",
  );
  const phone = getSettingValue(settings, "contact.phone", "(021) 426 5310");
  const address = getSettingValue(
    settings,
    "contact.address",
    "Gedung Indra Sentral Unit R & T, Jakarta Pusat, Indonesia",
  );
  const instagram = "https://www.instagram.com/pharmametriclabs/";
  const linkedin = "https://www.linkedin.com/company/pharma-metric-labs/";
  const storedCopyright = getSettingValue(
    settings,
    "footer.copyright",
    "Pharma Metric Labs. All rights reserved.",
  );

  const cleanedCopyright = storedCopyright
    .replace(/^©?\s*\d{4}\s*/i, "")
    .replace(/\b\d{4}\b\s*[|—-]?\s*/g, "");

  const copyright = isIndonesian
    ? "Pharma Metric Labs. Seluruh hak dilindungi."
    : cleanedCopyright;

  const openCookieSettings = () => {
    window.localStorage.removeItem("pml_cookie_consent_v1");
    window.localStorage.removeItem("pml_cookie_consent_v1_date");
    window.location.reload();
  };

  return (
    <footer className="relative overflow-hidden bg-[#f7f8f7] px-4 py-16">
      <div
        className="absolute inset-x-0 bottom-0 -z-0 overflow-hidden text-center"
        aria-hidden="true"
      >
        <div className="select-none text-[110px] font-black leading-none tracking-[-0.08em] text-[#039147]/[0.035] md:text-[280px] lg:text-[360px]">
          Pharma
        </div>
      </div>

      <div className="relative mx-auto w-[min(100%-24px,1600px)] md:w-[min(100%-48px,1600px)]">
        <div className="rounded-[34px] border border-black/5 bg-white px-6 py-10 shadow-[0_24px_90px_rgba(0,0,0,0.07)] md:rounded-[44px] md:px-10 md:py-12 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.7fr_0.8fr_0.8fr] lg:gap-12">
            <div>
              <Link
                href={localizeHref("/", locale)}
                className="inline-flex items-center"
                aria-label={`${companyName} Home`}
              >
                <Image
                  src="/images/LOGO-PML.png"
                  alt={companyName}
                  width={160}
                  height={84}
                  className="h-16 w-auto"
                />
              </Link>

              <p className="mt-6 max-w-md text-base leading-8 text-black/72 md:text-[17px]">
                {companyDescription}
              </p>

              <div className="mt-7 flex items-center gap-3">
                <SocialLink href={linkedin} label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6.5 9.5V18"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.5 6.2V6.3"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11 18V9.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11 13.2C11 11.1 12.3 9.3 14.6 9.3C16.8 9.3 18 10.8 18 13.3V18"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </SocialLink>

                <SocialLink href={instagram} label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="5"
                      y="5"
                      width="14"
                      height="14"
                      rx="4"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.2"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    />
                    <path
                      d="M16.4 7.8H16.5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </SocialLink>

                <SocialLink href={`mailto:${email}`} label="Email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="4"
                      y="6"
                      width="16"
                      height="12"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    />
                    <path
                      d="M5.5 8L12 13L18.5 8"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </SocialLink>
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-black md:text-lg">
                {isIndonesian ? "Halaman" : "Pages"}
              </h3>
              <div className="mt-5 grid gap-4 text-base font-semibold text-black/70 md:text-[17px]">
                {pageLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={localizeHref(item.href, locale)}
                    className="transition hover:text-[#039147]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-black md:text-lg">
                {isIndonesian ? "Layanan" : "Services"}
              </h3>
              <div className="mt-5 grid gap-4 text-base font-semibold text-black/70 md:text-[17px]">
                {serviceLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={localizeHref(item.href, locale)}
                    className="transition hover:text-[#039147]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-black md:text-lg">
                {isIndonesian ? "Kontak" : "Contact"}
              </h3>
              <div className="mt-5 grid gap-4 text-base font-semibold leading-8 text-black/70 md:text-[17px]">
                <a
                  href={`mailto:${email}`}
                  className="underline decoration-black/20 underline-offset-4 transition hover:text-[#039147] hover:decoration-[#039147]"
                >
                  {email}
                </a>
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                  className="transition hover:text-[#039147]"
                >
                  {phone}
                </a>
                <p>{address}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-black/10 pt-7">
            <div className="flex flex-col justify-between gap-5 text-sm font-semibold text-black/45 md:flex-row md:items-center">
              <p>
                © {new Date().getFullYear()} {copyright}
              </p>

              <div className="flex flex-wrap gap-5">
                <Link
                  href={localizeHref("/privacy-policy", locale)}
                  className="underline decoration-black/20 underline-offset-4 transition hover:text-[#039147] hover:decoration-[#039147]"
                >
                  {isIndonesian ? "Kebijakan Privasi" : "Privacy Policy"}
                </Link>
                <Link
                  href={localizeHref("/cookie-policy", locale)}
                  className="underline decoration-black/20 underline-offset-4 transition hover:text-[#039147] hover:decoration-[#039147]"
                >
                  {isIndonesian ? "Kebijakan Cookie" : "Cookie Policy"}
                </Link>
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="underline decoration-black/20 underline-offset-4 transition hover:text-[#039147] hover:decoration-[#039147]"
                >
                  {isIndonesian ? "Pengaturan Cookie" : "Cookie Settings"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
