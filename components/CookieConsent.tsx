"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const CONSENT_KEY = "pml_cookie_consent_v1";

type ConsentValue = "accepted" | "rejected";

export default function CookieConsent() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(CONSENT_KEY);

    if (!savedConsent) {
      const timer = window.setTimeout(() => {
        setIsVisible(true);
      }, 700);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, []);

  const saveConsent = (value: ConsentValue) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.localStorage.setItem(
      `${CONSENT_KEY}_date`,
      new Date().toISOString(),
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/42 px-4 py-8 backdrop-blur-[6px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-[30px] border border-white/40 bg-white p-6 shadow-[0_30px_120px_rgba(0,0,0,0.24)] md:p-8">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#eaf8f0]" />
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#f4fbf7]" />

        <div className="relative">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf8f0] text-sm font-black text-[#039147] shadow-sm">
              PML
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                Pharma Metric Labs
              </p>

              <p className="mt-1 text-sm font-bold text-black/48">
                {t("Cookie Preference", "Preferensi Cookies")}
              </p>
            </div>
          </div>

          <h2
            id="cookie-consent-title"
            className="text-3xl font-black leading-tight tracking-[-0.02em] text-black md:text-[34px]"
          >
            {t("Cookie Consent", "Persetujuan Cookies")}
          </h2>

          <p
            id="cookie-consent-description"
            className="mt-4 text-base font-medium leading-8 text-black/62"
          >
            {t(
              "We use cookies and similar technologies to support website functionality, understand website performance, and provide a better browsing experience. Essential technologies remain active, while optional analytics or third-party technologies are used according to your preference.",
              "Kami menggunakan cookies dan teknologi sejenis untuk mendukung fungsi website, memahami performa website, dan memberikan pengalaman penggunaan yang lebih baik. Teknologi yang diperlukan tetap aktif, sedangkan analitik atau teknologi pihak ketiga yang bersifat opsional digunakan sesuai pilihan Anda.",
            )}
          </p>

          <p className="mt-4 text-sm font-semibold leading-7 text-black/52">
            {t(
              "By selecting “Accept & Continue”, you agree to the use of optional cookies as described in our ",
              "Dengan memilih “Terima & Lanjutkan”, Anda menyetujui penggunaan cookies opsional sebagaimana dijelaskan dalam ",
            )}
            <Link
              href={localizeHref("/cookie-policy", locale)}
              className="font-black text-[#039147] underline-offset-4 hover:underline"
            >
              {t("Cookie Policy", "Kebijakan Cookies")}
            </Link>
            {t(" and ", " dan ")}
            <Link
              href={localizeHref("/privacy-policy", locale)}
              className="font-black text-[#039147] underline-offset-4 hover:underline"
            >
              {t("Privacy Policy", "Kebijakan Privasi")}
            </Link>
            .
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => saveConsent("rejected")}
              className="rounded-full border border-red-400/30 bg-red-500/10 px-6 py-3 text-sm font-black text-red-500 transition hover:bg-red-500 hover:text-white"
            >
              {t("Reject Optional Cookies", "Tolak Cookies Opsional")}
            </button>

            <button
              type="button"
              onClick={() => saveConsent("accepted")}
              className="rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5"
            >
              {t("Accept & Continue", "Terima & Lanjutkan")}
            </button>
          </div>

          <p className="mt-5 text-xs font-semibold leading-6 text-black/38">
            {t(
              "Your choice will be stored in this browser. The popup will appear again if the browser storage is cleared.",
              "Pilihan Anda akan disimpan pada browser ini. Popup akan muncul kembali apabila penyimpanan browser dihapus.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
