"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { getLocaleFromPathname, localizeHref } from "@/i18n/client";
import { submitProposal } from "@/lib/api";
import {
  fallbackPublicSettings,
  getPublicSettings,
  getSettingValue,
  PublicSettings,
} from "@/lib/public-settings";

function ContactIcon({ type }: { type: string }) {
  if (type === "phone") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M8.5 5.5L10.4 9.6L8.7 11.1C9.7 13.2 11.3 14.8 13.4 15.8L14.9 14.1L19 16L18.2 19.5C18 20.3 17.3 20.9 16.5 20.8C9.3 20.2 3.8 14.7 3.2 7.5C3.1 6.7 3.7 6 4.5 5.8L8.5 5.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "email") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="4"
          y="6"
          width="16"
          height="12"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M5.5 8L12 13L18.5 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21C12 21 19 15.8 19 9.8C19 5.9 15.9 3 12 3C8.1 3 5 5.9 5 9.8C5 15.8 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function ContactPageClient() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const [settings, setSettings] = useState<PublicSettings>(
    fallbackPublicSettings,
  );
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

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

  const officeAddress = getSettingValue(
    settings,
    "contact.address",
    "Gedung Indra Sentral Unit R & T, Jl. Let. Jend. Suprapto No. 60, Cempaka Putih, Jakarta Pusat 10520, Indonesia",
  );

  const phoneNumber = getSettingValue(
    settings,
    "contact.phone",
    "(+6221) 426 5310 / (+6221) 426 9475",
  );

  const primaryEmail = getSettingValue(
    settings,
    "contact.email",
    "info@pharmametriclabs.com",
  );

  const secondaryEmail = getSettingValue(
    settings,
    "contact.secondaryEmail",
    "Novida.aristyowati@pharmametriclabs.com",
  );

  const mapsQuery = encodeURIComponent(
    "PharmaMetric Labs, Jl. Let. Jend. Suprapto No. 60, Cempaka Putih, Jakarta Pusat 10520, Indonesia",
  );
  const phoneHref = `tel:${phoneNumber.replace(/[^0-9+]/g, "")}`;

  const contactCards = [
    {
      title: t("Office Address", "Alamat Kantor"),
      value: officeAddress,
      icon: "address",
    },
    {
      title: t("Phone Number", "Nomor Telepon"),
      value: phoneNumber,
      icon: "phone",
    },
    {
      title: t("Email Address", "Alamat Email"),
      value: primaryEmail,
      secondValue: secondaryEmail,
      icon: "email",
    },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitStatus("loading");
    setSubmitMessage("");

    try {
      await submitProposal({
        name,
        company: company || "-",
        email,
        serviceType: service,
        projectNeeds: message,
        sourcePage:
          typeof window !== "undefined" ? window.location.pathname : "/contact",
      });

      setSubmitStatus("success");
      setSubmitMessage(
        t(
          "Your inquiry has been submitted successfully. PML team will follow up soon.",
          "Inquiry Anda berhasil dikirim. Tim PML akan segera menindaklanjuti.",
        ),
      );
      setName("");
      setCompany("");
      setEmail("");
      setService("General Inquiry");
      setMessage("");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(
        error instanceof Error && !isIndonesian
          ? error.message
          : t(
              "Something went wrong. Please try again.",
              "Terjadi kesalahan. Silakan coba kembali.",
            ),
      );
    }
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-black text-white">
        <Image
          src="/images/pml/cta-lab-background.png"
          alt=""
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-[#039147]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/62 to-[#039147]/20" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.075]" />

        <div className="pml-container relative py-20 md:py-32">
          <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm font-bold text-black/58">
            <Link
              href={localizeHref("/", locale)}
              className="transition hover:text-[#039147]"
            >
              {t("Home", "Beranda")}
            </Link>
            <span>/</span>
            <span className="text-[#039147]">
              {t("Contact Us", "Hubungi Kami")}
            </span>
          </nav>

          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#039147]/15 bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#039147] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#039147]" />
              {t("Contact Us", "Hubungi Kami")}
            </p>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-black md:text-6xl lg:text-[68px]">
              {t("We are here to help!", "Kami siap membantu Anda!")}
            </h1>

            <p className="mt-6 max-w-2xl text-[17px] leading-8 text-black/70 md:text-[19px] md:leading-9 md:text-lg">
              {t(
                "Let's discuss your project! Share your inquiry and our team will help you identify the right solution and next steps.",
                "Mari diskusikan proyek Anda. Sampaikan inquiry Anda dan tim kami akan membantu menentukan solusi serta langkah berikutnya yang tepat.",
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-extrabold text-[#039147] shadow-xl"
              >
                {t("Send an Inquiry", "Kirim Inquiry")}
              </a>

              <a
                href={phoneHref}
                className="inline-flex items-center justify-center rounded-full border border-[#039147]/20 bg-white px-7 py-4 text-base font-extrabold text-[#039147] shadow-xl backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#039147] hover:text-white"
              >
                {t("Call PML", "Hubungi PML")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-form" className="bg-[#f6faf7] py-16 md:py-28">
        <div className="pml-container grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
              {t("Get in Touch", "Hubungi Kami")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Complete the form below and our team will be in touch",
                "Lengkapi formulir berikut dan tim kami akan menghubungi Anda",
              )}
            </h2>

            <p className="mt-5 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:mt-6 md:text-lg md:leading-9">
              {t(
                "Please provide your name, contact details, service of interest, and a brief message so we can assist you effectively.",
                "Silakan isi nama, detail kontak, layanan yang diminati, dan pesan singkat agar kami dapat membantu Anda secara tepat.",
              )}
            </p>

            <div className="mt-8 grid gap-3 md:gap-4">
              {contactCards.map((card) => (
                <div
                  key={card.title}
                  className="flex gap-3 rounded-[22px] border border-black/5 bg-white p-4 shadow-sm md:gap-4 md:rounded-[26px] md:p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#039147] md:h-12 md:w-12">
                    <ContactIcon type={card.icon} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.12em] text-black/45">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-base font-bold leading-7 text-black/70 md:leading-7">
                      {card.value}
                    </p>
                    {card.secondValue ? (
                      <p className="mt-1 text-base font-bold leading-7 text-black/70 md:leading-7">
                        {card.secondValue}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.08)] md:rounded-[36px] md:p-8"
          >
            <div className="grid gap-4 md:grid-cols-2 md:gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-black text-black">
                  {t("Your Name*", "Nama Anda*")}
                </span>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-14 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                  placeholder={t("Your full name", "Nama lengkap Anda")}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">
                  {t("Email Address*", "Alamat Email*")}
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-14 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                  placeholder="you@company.com"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">
                  {t("Company", "Perusahaan")}
                </span>
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className="h-14 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                  placeholder={t("Company name", "Nama perusahaan")}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">
                  {t("Service Interest", "Layanan yang Diminati")}
                </span>
                <select
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  className="h-14 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                >
                  <option value="General Inquiry">
                    {t("General Inquiry", "Inquiry Umum")}
                  </option>
                  <option value="Contract Analysis">
                    {t("Contract Analysis", "Analisis Kontrak")}
                  </option>
                  <option value="BA/BE Study">
                    {t("BA/BE Study", "Studi BA/BE")}
                  </option>
                  <option value="Clinical Trial">
                    {t("Clinical Trial", "Uji Klinis")}
                  </option>
                  <option value="Regulatory Management">
                    {t("Regulatory Management", "Manajemen Regulasi")}
                  </option>
                </select>
              </label>

              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-black text-black">
                  {t("Your Message*", "Pesan Anda*")}
                </span>
                <textarea
                  required
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={6}
                  className="resize-none rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                  placeholder={t(
                    "Tell us about your inquiry, project needs, timeline, or questions...",
                    "Ceritakan inquiry, kebutuhan proyek, jadwal, atau pertanyaan Anda...",
                  )}
                />
              </label>
            </div>

            {submitMessage ? (
              <div
                className={`mt-6 rounded-2xl p-4 text-sm font-bold ${
                  submitStatus === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {submitMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitStatus === "loading"}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#039147] px-8 py-4 text-base font-extrabold text-white shadow-[0_18px_40px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              {submitStatus === "loading"
                ? t("Sending...", "Mengirim...")
                : t("Send Inquiry", "Kirim Inquiry")}
            </button>

            <p className="mt-5 text-xs font-semibold leading-6 text-black/45">
              {t(
                "This form is connected to the PML NestJS backend and stored securely for follow-up.",
                "Formulir ini terhubung ke backend NestJS PML dan disimpan secara aman untuk proses tindak lanjut.",
              )}
            </p>
          </form>
        </div>
      </section>

      <section className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch lg:gap-10">
            <div className="rounded-[30px] border border-black/5 bg-[#f6faf7] p-6 shadow-sm md:rounded-[36px] md:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("Location Map", "Peta Lokasi")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Visit Pharma Metric Labs’ Head Office",
                  "Kunjungi Kantor Pusat Pharma Metric Labs",
                )}
              </h2>

              <p className="mt-5 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:mt-6 md:text-lg md:leading-9">
                {t(
                  "We'd be happy to welcome you to our Head Office. Find our location using the map below and plan your visit.",
                  "Kami dengan senang hati menyambut Anda di kantor pusat kami. Temukan lokasi kami melalui peta berikut dan rencanakan kunjungan Anda.",
                )}
              </p>

              <div className="mt-7 grid gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#039147] px-7 py-4 text-base font-extrabold text-white shadow-[0_18px_40px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
                >
                  {t("Open in Google Maps", "Buka di Google Maps")}
                </a>

                <a
                  href={phoneHref}
                  className="inline-flex items-center justify-center rounded-full border border-[#039147]/20 bg-white px-7 py-4 text-base font-extrabold text-[#039147] shadow-xl transition hover:-translate-y-0.5 hover:bg-[#eaf8f0] hover:text-[#039147]"
                >
                  {t("Call Before Visit", "Hubungi Sebelum Berkunjung")}
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-black/5 bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.10)] md:rounded-[36px] md:p-3">
              <iframe
                title={t(
                  "Pharma Metric Labs Location Map",
                  "Peta Lokasi Pharma Metric Labs",
                )}
                src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                className="h-[320px] w-full rounded-[24px] border-0 md:h-full md:min-h-[470px] md:rounded-[28px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="relative overflow-hidden rounded-[30px] bg-black px-6 py-14 text-center text-black shadow-[0_28px_90px_rgba(0,0,0,0.18)] md:rounded-[36px] md:px-14 md:py-20">
            <Image
              src="/images/pml/facilities-gallery/analytical-main.jpg"
              alt=""
              fill
              className="object-cover opacity-52"
            />
            <div className="absolute inset-0 bg-white/38" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/78 via-white/46 to-[#039147]/10" />
            <div className="pml-hex-pattern-light absolute inset-0 opacity-[0.10]" />

            <div className="relative mx-auto max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Business Opportunity", "Peluang Bisnis")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight md:text-[52px] text-black">
                {t(
                  "Looking for business opportunity?",
                  "Sedang mencari peluang kerja sama bisnis?",
                )}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-black/72">
                {t(
                  "Contact PML to discuss study collaboration, laboratory testing, regulatory needs, or other project opportunities.",
                  "Hubungi PML untuk mendiskusikan kolaborasi studi, pengujian laboratorium, kebutuhan regulasi, atau peluang proyek lainnya.",
                )}
              </p>

              <a
                href={`mailto:${primaryEmail}`}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-extrabold text-[#039147] shadow-xl transition hover:-translate-y-0.5"
              >
                {t("Email PML", "Kirim Email ke PML")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
