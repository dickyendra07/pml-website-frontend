"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getLocaleFromPathname } from "@/i18n/client";
import type { Locale } from "@/i18n/config";

type LanguageSwitcherProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

function getLocalizedPath(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "en" || segments[0] === "id") {
    segments[0] = targetLocale;
    return `/${segments.join("/")}`;
  }

  return `/${targetLocale}${pathname === "/" ? "" : pathname}`;
}

export default function LanguageSwitcher({
  mobile = false,
  onNavigate,
}: LanguageSwitcherProps) {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);

  return (
    <div
      className={`relative isolate flex items-center overflow-hidden rounded-full border border-black/8 bg-[#f1f5f2] p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.08)] ring-1 ring-white ${
        mobile ? "w-full" : "w-[142px]"
      }`}
      aria-label={locale === "id" ? "Pilih bahasa" : "Select language"}
    >
      <span
        aria-hidden="true"
        className={`absolute bottom-1.5 top-1.5 -z-0 w-[calc(50%-6px)] rounded-full bg-[#039147] shadow-[0_10px_24px_rgba(3,145,71,0.28)] transition-transform duration-300 ease-out ${
          locale === "id" ? "translate-x-[calc(100%+0px)]" : "translate-x-0"
        }`}
      />

      <Link
        href={getLocalizedPath(pathname, "en")}
        onClick={onNavigate}
        aria-label="English"
        aria-current={locale === "en" ? "page" : undefined}
        className={`relative z-10 flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-xs font-black tracking-[0.08em] transition duration-300 ${
          locale === "en" ? "text-white" : "text-black/46 hover:text-black"
        }`}
      >
        <span className="text-[13px]">EN</span>
      </Link>

      <Link
        href={getLocalizedPath(pathname, "id")}
        onClick={onNavigate}
        aria-label="Bahasa Indonesia"
        aria-current={locale === "id" ? "page" : undefined}
        className={`relative z-10 flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-xs font-black tracking-[0.08em] transition duration-300 ${
          locale === "id" ? "text-white" : "text-black/46 hover:text-black"
        }`}
      >
        <span className="text-[13px]">ID</span>
      </Link>
    </div>
  );
}
