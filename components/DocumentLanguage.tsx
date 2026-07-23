"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { getLocaleFromPathname } from "@/i18n/client";

export default function DocumentLanguage() {
  const pathname = usePathname();

  useEffect(() => {
    const isAdminRoute = pathname?.startsWith("/admin");
    const locale = isAdminRoute ? "en" : getLocaleFromPathname(pathname);

    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
}
