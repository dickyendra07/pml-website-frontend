import en from "./dictionaries/en.json";
import id from "./dictionaries/id.json";
import { defaultLocale, isLocale, type Locale } from "./config";

const dictionaries = {
  en,
  id,
};

export function getLocaleFromPathname(pathname: string | null): Locale {
  const segment = pathname?.split("/").filter(Boolean)[0];

  return segment && isLocale(segment) ? segment : defaultLocale;
}

export function getClientDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function localizeHref(href: string, locale: Locale) {
  if (
    href.startsWith("#") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  if (href === "/") {
    return `/${locale}`;
  }

  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) {
    return href;
  }

  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}
