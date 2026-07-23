"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { getLocaleFromPathname } from "@/i18n/client";

type PublicServiceStatus = "operational" | "unavailable";

type PublicHealthResult = {
  status: "operational" | "degraded";
  checkedAt: string;
  services: {
    website: "operational";
    backend: "operational";
    database: PublicServiceStatus;
    caching: PublicServiceStatus;
  };
};

type PageStatus = "loading" | "success" | "error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

function formatDate(value: string, isIndonesian: boolean) {
  return new Intl.DateTimeFormat(isIndonesian ? "id-ID" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
}

function StatusIcon({
  type,
}: {
  type: "website" | "backend" | "database" | "caching";
}) {
  if (type === "website") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M3.5 12H20.5M12 3C14.4 5.5 15.7 8.5 15.7 12C15.7 15.5 14.4 18.5 12 21M12 3C9.6 5.5 8.3 8.5 8.3 12C8.3 15.5 9.6 18.5 12 21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "backend") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect
          x="4"
          y="5"
          width="16"
          height="5"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="4"
          y="14"
          width="16"
          height="5"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 7.5H8.01M8 16.5H8.01M12 7.5H17M12 16.5H17"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "database") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <ellipse
          cx="12"
          cy="6"
          rx="7"
          ry="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M5 6V12C5 13.7 8.1 15 12 15C15.9 15 19 13.7 19 12V6"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M5 12V18C5 19.7 8.1 21 12 21C15.9 21 19 19.7 19 18V12"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 3H16V7H20V15H16V19H8V15H4V7H8V3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 9H15V13H9V9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 1V3M12 1V3M16 1V3M8 19V21M12 19V21M16 19V21M2 8H4M2 12H4M2 16H4M20 8H22M20 12H22M20 16H22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StatusCard({
  number,
  label,
  description,
  status,
  type,
  normalLabel,
  attentionLabel,
  operationalLabel,
  unavailableLabel,
}: {
  number: string;
  label: string;
  description: string;
  status: PublicServiceStatus;
  type: "website" | "backend" | "database" | "caching";
  normalLabel: string;
  attentionLabel: string;
  operationalLabel: string;
  unavailableLabel: string;
}) {
  const operational = status === "operational";

  return (
    <article className="group relative min-h-[310px] overflow-hidden rounded-[30px] border border-black/[0.06] bg-white p-6 shadow-[0_22px_70px_rgba(18,58,38,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#039147]/20 hover:shadow-[0_30px_90px_rgba(3,145,71,0.14)] xl:p-7">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#f0faf4] transition duration-500 group-hover:scale-125" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-black/[0.03]">
        <div
          className={`h-full transition-all duration-700 ${
            operational ? "w-full bg-[#039147]" : "w-1/3 bg-red-500"
          }`}
        />
      </div>

      <div className="relative flex items-start justify-between gap-5">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-[18px] ${
            operational
              ? "bg-[#eaf8f0] text-[#039147]"
              : "bg-red-50 text-red-600"
          }`}
        >
          <StatusIcon type={type} />
        </div>

        <span className="text-[42px] font-black leading-none tracking-[-0.05em] text-black/[0.045]">
          {number}
        </span>
      </div>

      <div className="relative mt-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-[23px] font-black tracking-[-0.025em] text-black">
            {label}
          </h2>

          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${
              operational
                ? "border-[#039147]/15 bg-[#eaf8f0] text-[#039147]"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                operational
                  ? "bg-[#039147] shadow-[0_0_0_5px_rgba(3,145,71,0.09)]"
                  : "bg-red-500 shadow-[0_0_0_5px_rgba(239,68,68,0.09)]"
              }`}
            />
            {operational ? operationalLabel : unavailableLabel}
          </span>
        </div>

        <p className="mt-4 min-h-[56px] text-sm font-semibold leading-7 text-black/50">
          {description}
        </p>
      </div>

      <div className="relative mt-7 border-t border-black/[0.06] pt-5">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-black/30">
          Service condition
        </p>

        <div className="mt-3 flex items-center gap-3">
          <span
            className={`h-3.5 w-3.5 rounded-full ${
              operational
                ? "bg-[#039147] shadow-[0_0_0_7px_rgba(3,145,71,0.10)]"
                : "bg-red-500 shadow-[0_0_0_7px_rgba(239,68,68,0.10)]"
            }`}
          />

          <span className="text-sm font-black text-black/58">
            {operational ? normalLabel : attentionLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function SystemStatusClient() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const t = useCallback(
    (english: string, indonesian: string) =>
      isIndonesian ? indonesian : english,
    [isIndonesian],
  );

  const [health, setHealth] = useState<PublicHealthResult | null>(null);
  const [status, setStatus] = useState<PageStatus>("loading");
  const [message, setMessage] = useState("");

  const loadHealth = useCallback(async () => {
    setStatus("loading");
    setMessage("");

    if (!API_BASE_URL) {
      setStatus("error");
      setMessage(
        t(
          "The status service is not configured.",
          "Layanan status sistem belum dikonfigurasi.",
        ),
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/health/public`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to retrieve system status.");
      }

      const result = (await response.json()) as PublicHealthResult;

      setHealth(result);
      setStatus("success");
    } catch {
      setHealth(null);
      setStatus("error");
      setMessage(
        t(
          "System status is temporarily unavailable. Please contact the PML technical team.",
          "Status sistem sementara tidak tersedia. Silakan hubungi tim teknis PML.",
        ),
      );
    }
  }, [t]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHealth();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadHealth]);

  const operational = status === "success" && health?.status === "operational";

  const services = health
    ? [
        {
          number: "01",
          type: "website" as const,
          label: t("Website", "Website"),
          description: t(
            "Public website availability, navigation, and interface access.",
            "Ketersediaan website publik, navigasi, dan akses antarmuka.",
          ),
          status: health.services.website,
        },
        {
          number: "02",
          type: "backend" as const,
          label: t("Backend Service", "Layanan Backend"),
          description: t(
            "Core application processing and internal service communication.",
            "Pemrosesan aplikasi utama dan komunikasi layanan internal.",
          ),
          status: health.services.backend,
        },
        {
          number: "03",
          type: "database" as const,
          label: t("Database", "Database"),
          description: t(
            "Primary data storage connectivity and service availability.",
            "Konektivitas penyimpanan data utama dan ketersediaan layanan.",
          ),
          status: health.services.database,
        },
        {
          number: "04",
          type: "caching" as const,
          label: t("Caching", "Caching"),
          description: t(
            "Temporary data processing and performance service availability.",
            "Pemrosesan data sementara dan ketersediaan layanan performa.",
          ),
          status: health.services.caching,
        },
      ]
    : [];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4fbf7] text-black">
      <section className="relative border-b border-black/[0.04] px-5 py-14 md:px-8 md:py-20 xl:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(3,145,71,0.10),transparent_30%),radial-gradient(circle_at_8%_82%,rgba(3,145,71,0.06),transparent_32%)]" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.025]" />

        <div className="relative mx-auto w-full max-w-[1680px]">
          <header className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#039147]" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#039147]">
                  Pharma Metric Labs
                </p>
              </div>

              <h1 className="mt-5 text-5xl font-black tracking-[-0.045em] text-black md:text-7xl">
                {t("System Status", "Status Sistem")}
              </h1>

              <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-black/52 md:text-lg">
                {t(
                  "Real-time availability overview of essential Pharma Metric Labs digital services and infrastructure.",
                  "Ringkasan ketersediaan layanan digital dan infrastruktur utama Pharma Metric Labs secara real-time.",
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadHealth()}
              disabled={status === "loading"}
              className="inline-flex h-13 w-fit items-center justify-center gap-3 rounded-full bg-[#039147] px-7 text-sm font-black text-white shadow-[0_20px_55px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5 hover:bg-[#027c3d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full bg-white ${
                  status === "loading" ? "animate-pulse" : ""
                }`}
              />
              {status === "loading"
                ? t("Checking Status...", "Memeriksa Status...")
                : t("Refresh Status", "Perbarui Status")}
            </button>
          </header>
        </div>
      </section>

      <section className="px-5 py-10 md:px-8 md:py-14 xl:px-12">
        <div className="mx-auto w-full max-w-[1680px]">
          <section
            className={`relative overflow-hidden rounded-[34px] border p-7 shadow-[0_30px_100px_rgba(18,58,38,0.10)] md:p-10 xl:p-12 ${
              status === "loading"
                ? "border-black/[0.05] bg-white"
                : operational
                  ? "border-[#039147]/10 bg-gradient-to-br from-white via-white to-[#eaf8f0]"
                  : "border-red-100 bg-gradient-to-br from-white via-white to-red-50"
            }`}
          >
            <div className="absolute right-0 top-0 h-full w-[38%] bg-[radial-gradient(circle_at_center,rgba(3,145,71,0.09),transparent_66%)]" />
            <div className="pml-hex-pattern absolute inset-0 opacity-[0.025]" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      status === "loading"
                        ? "animate-pulse bg-black/25"
                        : operational
                          ? "bg-[#039147] shadow-[0_0_0_8px_rgba(3,145,71,0.10)]"
                          : "bg-red-500 shadow-[0_0_0_8px_rgba(239,68,68,0.10)]"
                    }`}
                  />

                  <p className="text-xs font-black uppercase tracking-[0.18em] text-black/38">
                    {t("Overall Status", "Status Keseluruhan")}
                  </p>
                </div>

                <h2 className="mt-5 max-w-5xl text-3xl font-black leading-tight tracking-[-0.035em] text-black md:text-5xl xl:text-[58px]">
                  {status === "loading"
                    ? t(
                        "Checking monitored services",
                        "Memeriksa layanan yang dipantau",
                      )
                    : operational
                      ? t(
                          "All monitored services are operational",
                          "Seluruh layanan yang dipantau beroperasi normal",
                        )
                      : t(
                          "One or more services require attention",
                          "Satu atau beberapa layanan memerlukan perhatian",
                        )}
                </h2>

                {status === "error" ? (
                  <p className="mt-5 max-w-3xl text-sm font-bold leading-7 text-red-700">
                    {message}
                  </p>
                ) : null}

                {health ? (
                  <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <p className="text-sm font-bold text-black/45">
                      {t("Last checked", "Terakhir diperiksa")}:{" "}
                      <span className="font-black text-black/65">
                        {formatDate(health.checkedAt, isIndonesian)}
                      </span>
                    </p>

                    <p className="text-sm font-bold text-black/45">
                      {t("Monitoring mode", "Mode pemantauan")}:{" "}
                      <span className="font-black text-[#039147]">
                        {t("Live", "Aktif")}
                      </span>
                    </p>
                  </div>
                ) : null}
              </div>

              <div
                className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[10px] text-2xl font-black md:h-36 md:w-36 md:text-3xl ${
                  status === "loading"
                    ? "border-black/[0.04] bg-white text-black/30"
                    : operational
                      ? "border-[#e2f5ea] bg-[#039147] text-white shadow-[0_28px_75px_rgba(3,145,71,0.30)]"
                      : "border-red-100 bg-red-500 text-white shadow-[0_28px_75px_rgba(239,68,68,0.25)]"
                }`}
              >
                {status === "loading" ? "..." : operational ? "OK" : "!"}
              </div>
            </div>
          </section>

          {health ? (
            <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {services.map((service) => (
                <StatusCard
                  key={service.type}
                  {...service}
                  operationalLabel={t("Operational", "Operasional")}
                  unavailableLabel={t("Unavailable", "Tidak Tersedia")}
                  normalLabel={t(
                    "Service is responding normally",
                    "Layanan merespons secara normal",
                  )}
                  attentionLabel={t(
                    "Service requires attention",
                    "Layanan memerlukan perhatian",
                  )}
                />
              ))}
            </section>
          ) : null}

          <footer className="mt-8 flex flex-col justify-between gap-5 rounded-[28px] border border-black/[0.05] bg-white px-6 py-6 shadow-[0_16px_50px_rgba(18,58,38,0.05)] md:flex-row md:items-center md:px-8">
            <div>
              <p className="text-sm font-black text-black">
                {t("Public system availability", "Ketersediaan sistem publik")}
              </p>

              <p className="mt-2 max-w-4xl text-sm font-semibold leading-7 text-black/45">
                {t(
                  "This page displays general service availability only. Server addresses, credentials, technology details, and internal diagnostics remain protected.",
                  "Halaman ini hanya menampilkan ketersediaan layanan secara umum. Alamat server, kredensial, detail teknologi, dan diagnosis internal tetap dilindungi.",
                )}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-full bg-[#eaf8f0] px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#039147]" />
              <span className="text-xs font-black uppercase tracking-[0.13em] text-[#039147]">
                {t("Secure View", "Tampilan Aman")}
              </span>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
