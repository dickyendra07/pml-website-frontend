"use client";

import { useLayoutEffect } from "react";

import type { Locale } from "@/i18n/config";

type DocumentLanguageProps = {
  locale: Locale;
};

export default function DocumentLanguage({ locale }: DocumentLanguageProps) {
  useLayoutEffect(() => {
    const documentElement = document.documentElement;

    documentElement.lang = locale;
    documentElement.dataset.locale = locale;

    return () => {
      documentElement.lang = "en";
      documentElement.dataset.locale = "en";
    };
  }, [locale]);

  return null;
}
