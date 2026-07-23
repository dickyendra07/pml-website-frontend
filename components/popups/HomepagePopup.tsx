"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

type PopupLayout = "IMAGE_LEFT" | "IMAGE_RIGHT" | "IMAGE_TOP" | "TEXT_ONLY";

type PopupItem = {
  id: string;
  title: string;
  description: string | null;
  buttonLabel: string | null;
  buttonUrl: string | null;
  imageUrl: string | null;
  frequency: "ONCE_PER_SESSION" | "ONCE_PER_DAY" | "ALWAYS" | string;
  layout?: PopupLayout | null;
};

type PopupResponse = {
  popup: PopupItem | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "development" ? "http://localhost:4000/api" : "");

const hasApiBaseUrl = API_BASE_URL.length > 0;

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

function getStorageKey(popupId: string) {
  return `pml_popup_closed_${popupId}`;
}

function getTodayStorageKey(popupId: string) {
  const today = new Date().toISOString().slice(0, 10);
  return `pml_popup_closed_${popupId}_${today}`;
}

function getAssetUrl(value: string | null) {
  if (!value) return "";

  if (value.startsWith("http")) {
    return value;
  }

  if (value.startsWith("/uploads")) {
    return `${API_ORIGIN}${value}`;
  }

  return value;
}

function shouldHidePopup(popup: PopupItem) {
  if (popup.frequency === "ALWAYS") {
    return false;
  }

  if (popup.frequency === "ONCE_PER_DAY") {
    return window.localStorage.getItem(getTodayStorageKey(popup.id)) === "true";
  }

  return window.sessionStorage.getItem(getStorageKey(popup.id)) === "true";
}

function markPopupClosed(popup: PopupItem) {
  if (popup.frequency === "ONCE_PER_DAY") {
    window.localStorage.setItem(getTodayStorageKey(popup.id), "true");
    return;
  }

  if (popup.frequency === "ONCE_PER_SESSION") {
    window.sessionStorage.setItem(getStorageKey(popup.id), "true");
  }
}

export default function HomepagePopup() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const [popup, setPopup] = useState<PopupItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const layout = popup?.layout || "IMAGE_LEFT";
  const imageUrl = getAssetUrl(popup?.imageUrl || null);
  const hasImage = Boolean(imageUrl) && layout !== "TEXT_ONLY";

  const shellClassName = useMemo(() => {
    if (layout === "IMAGE_TOP") {
      return "grid";
    }

    if (layout === "TEXT_ONLY") {
      return "grid";
    }

    if (layout === "IMAGE_RIGHT") {
      return "grid md:grid-cols-[1.05fr_0.95fr]";
    }

    return "grid md:grid-cols-[0.95fr_1.05fr]";
  }, [layout]);

  useEffect(() => {
    let isMounted = true;

    async function loadPopup() {
      if (!hasApiBaseUrl) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/popups/active?path=/`, {
          cache: "no-store",
        });

        if (!response.ok) return;

        const result = (await response.json()) as PopupResponse;

        if (!isMounted || !result.popup) return;

        if (shouldHidePopup(result.popup)) {
          return;
        }

        setPopup(result.popup);

        window.setTimeout(() => {
          if (isMounted) setIsVisible(true);
        }, 700);
      } catch {
        // Silent fail. Popup should never break the homepage.
      }
    }

    void loadPopup();

    return () => {
      isMounted = false;
    };
  }, []);

  const closePopup = () => {
    if (popup) {
      markPopupClosed(popup);
    }

    setIsVisible(false);

    window.setTimeout(() => {
      setPopup(null);
    }, 250);
  };

  if (!popup) return null;

  const imageBlock = hasImage ? (
    <div
      className={`relative overflow-hidden bg-black ${
        layout === "IMAGE_TOP"
          ? "min-h-[220px] md:min-h-[320px]"
          : "min-h-[190px] md:min-h-[420px]"
      }`}
    >
      <Image
        src={imageUrl}
        alt=""
        fill
        priority={false}
        sizes={
          layout === "IMAGE_TOP" ? "920px" : "(max-width: 768px) 100vw, 460px"
        }
        className="object-cover opacity-90"
        unoptimized={
          imageUrl.startsWith("http://localhost") ||
          imageUrl.startsWith(API_ORIGIN)
        }
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-black/25 to-[#039147]/55" />
      <div className="pml-hex-pattern-light absolute inset-0 opacity-[0.12]" />

      <div className="absolute bottom-5 left-5 right-5 rounded-[24px] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/65">
          Pharma Metric Labs
        </p>
        <p className="mt-2 text-lg font-black leading-tight">
          {t("Integrated CRO Services", "Layanan CRO Terintegrasi")}
        </p>
      </div>
    </div>
  ) : null;

  const contentBlock = (
    <div
      className={`bg-white p-6 md:p-10 lg:p-12 ${layout === "TEXT_ONLY" ? "text-center" : ""}`}
    >
      <p className="inline-flex rounded-full bg-[#eaf8f0] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#039147]">
        {t("Announcement", "Pengumuman")}
      </p>

      <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-black md:text-5xl">
        {popup.title}
      </h2>

      {popup.description ? (
        <p
          className={`mt-5 text-sm font-medium leading-7 text-black/60 md:text-base md:leading-8 ${
            layout === "TEXT_ONLY" ? "mx-auto max-w-2xl" : ""
          }`}
        >
          {popup.description}
        </p>
      ) : null}

      <div
        className={`mt-8 flex flex-col gap-3 sm:flex-row ${
          layout === "TEXT_ONLY" ? "justify-center" : ""
        }`}
      >
        {popup.buttonLabel && popup.buttonUrl ? (
          <Link
            href={localizeHref(popup.buttonUrl, locale)}
            onClick={closePopup}
            className="inline-flex items-center justify-center rounded-full bg-[#039147] px-7 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(3,145,71,0.25)] transition hover:-translate-y-0.5 hover:bg-[#02783b]"
          >
            {popup.buttonLabel}
          </Link>
        ) : null}

        <button
          type="button"
          onClick={closePopup}
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black/[0.03] px-7 py-4 text-sm font-black text-black/70 transition hover:bg-black hover:text-white"
        >
          {t("Maybe Later", "Nanti Saja")}
        </button>
      </div>

      <p className="mt-5 text-xs font-semibold leading-5 text-black/35">
        {t(
          "This popup can be managed from the admin CMS.",
          "Popup ini dapat dikelola melalui CMS admin.",
        )}
      </p>
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-end justify-center bg-black/45 px-4 pb-4 backdrop-blur-sm transition-opacity duration-300 md:items-center md:pb-0 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={popup.title}
    >
      <div
        className={`relative w-full overflow-hidden rounded-[28px] border border-white/15 bg-white shadow-[0_32px_120px_rgba(0,0,0,0.35)] transition-all duration-300 md:rounded-[36px] ${
          layout === "TEXT_ONLY" ? "max-w-[680px]" : "max-w-[920px]"
        } ${isVisible ? "translate-y-0 scale-100" : "translate-y-8 scale-[0.98]"}`}
      >
        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/90 text-xl font-black text-black shadow-lg transition hover:bg-black hover:text-white"
          aria-label={t("Close popup", "Tutup popup")}
        >
          ×
        </button>

        <div className={shellClassName}>
          {layout === "IMAGE_RIGHT" ? (
            <>
              {contentBlock}
              {imageBlock}
            </>
          ) : (
            <>
              {imageBlock}
              {contentBlock}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
