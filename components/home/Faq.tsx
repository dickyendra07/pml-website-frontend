import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";

const faqs = [
  [
    "What services does Pharma Metric Labs provide?",
    "PML provides integrated CRO services including BA/BE study, clinical trial, contract analysis, and regulatory management for pharmaceutical and related industries.",
  ],
  [
    "Can PML support both local and international sponsors?",
    "Yes. PML supports both local and overseas sponsors, including companies that require clinical, analytical, regulatory, and documentation support in Indonesia.",
  ],
  [
    "What types of studies can be discussed with PML?",
    "Sponsors can discuss BA/BE study, clinical research projects, analytical testing needs, regulatory strategy, product registration support, and related project requirements.",
  ],
  [
    "How do we start a project or request a proposal?",
    "You can submit a request through the proposal form and share your study, testing, registration, or consultation needs. The PML team will review the requirements and recommend the next steps.",
  ],
  [
    "Does PML provide regulatory management?",
    "Yes. PML provides regulatory management support including BPOM-focused guidance, document review, dossier gap analysis, ACTD preparation, and submission readiness support.",
  ],
];

export default function Faq() {
  return (
    <section className="relative overflow-hidden bg-black py-20 md:py-28">
      <Image
        src="/images/pml/cta-lab-background.png"
        alt=""
        fill
        className="object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/70 to-[#039147]/55" />
      <div className="pml-hex-pattern absolute inset-0 opacity-[0.10]" />

      <div className="pml-container relative z-10">
        <SectionHeader
          align="center"
          dark
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="General information about working with Pharma Metric Labs for CRO, clinical, analytical, and regulatory support services."
        />

        <div className="mx-auto mt-12 max-w-4xl space-y-4">
          {faqs.map(([question, answer]) => (
            <details
              key={question}
              className="group rounded-[28px] border border-white/15 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                <h3 className="text-base font-black leading-6 text-black md:text-lg">
                  {question}
                </h3>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaf8f0] text-xl font-black text-[#039147] transition group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-5 max-w-3xl text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:text-lg">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
