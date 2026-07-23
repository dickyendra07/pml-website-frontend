"use client";

import Image from "next/image";
import Link from "next/link";

type CTACardProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function CTACard({
  eyebrow = "Start a Project",
  title = "We are ready to support you",
  description = "Share your project needs with our team and we will help you identify the right service scope, required information, and next steps.",
  primaryLabel = "Request a Proposal",
  secondaryLabel = "Discuss Your Needs",
  secondaryHref = "/contact",
}: CTACardProps) {
  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto w-[min(100%-24px,1400px)]">
        <div className="relative overflow-hidden rounded-[34px] bg-[#f4fbf7] px-6 py-14 text-center text-black shadow-[0_28px_90px_rgba(0,0,0,0.10)] md:rounded-[42px] md:px-12 md:py-20">
          <Image
            src="/images/pml/cta-lab-background.png"
            alt=""
            fill
            className="object-cover opacity-58"
          />

          <div className="absolute inset-0 bg-white/46" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/84 via-white/56 to-[#039147]/20" />
          <div className="pml-hex-pattern absolute inset-0 opacity-[0.055]" />

          <svg
            className="absolute -right-24 -top-24 h-[360px] w-[360px] text-[#039147]/10"
            viewBox="0 0 400 400"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M200 20L356 110V290L200 380L44 290V110L200 20Z"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#039147]/10 bg-white/90 shadow-lg backdrop-blur">
              <Image
                src="/images/LOGO-PML.png"
                alt="PML"
                width={72}
                height={44}
                className="h-8 w-auto"
              />
            </div>

            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              {eyebrow}
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight text-black md:text-5xl">
              {title}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-8 text-black/70 md:text-[19px] md:leading-9">
              {description}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openProposal}
                className="inline-flex items-center justify-center rounded-full bg-[#039147] px-8 py-4 text-base font-extrabold text-white shadow-[0_18px_44px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5 hover:bg-[#027a3c]"
              >
                {primaryLabel}
              </button>

              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/85 px-8 py-4 text-base font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
