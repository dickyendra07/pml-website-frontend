import SectionHeader from "@/components/ui/SectionHeader";

const testimonials = [
  [
    "PML provides responsive support and clear communication throughout the study process, helping our team move from planning to reporting with confidence.",
    "Pharmaceutical Sponsor",
    "BA/BE Project Partner",
  ],
  [
    "The team understands clinical and regulatory requirements, making coordination smoother across study preparation, execution, and documentation.",
    "Clinical Research Partner",
    "Clinical Trial Collaboration",
  ],
  [
    "PML combines laboratory capability with practical project support, which is valuable for analytical testing and submission-related activities.",
    "Regulatory & Analysis Client",
    "Contract Analysis Project",
  ],
];

export default function Testimonials() {
  return (
    <section className="bg-white py-16 md:py-28">
      <div className="pml-container">
        <SectionHeader
          align="center"
          eyebrow="Testimonials"
          title="Trusted by sponsors and partners"
          description="PML supports local and international pharmaceutical partners through responsive project coordination, reliable study execution, and regulatory-ready documentation."
        />

        <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:mt-12 md:grid md:overflow-visible md:px-0 md:pb-0 md:grid-cols-3 md:gap-6">
          {testimonials.map(([quote, name, role]) => (
            <article
              key={name}
              className="flex h-full min-w-[86%] snap-start flex-col rounded-[28px] border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:min-w-[48%] md:min-w-0 md:rounded-[32px] md:p-8"
            >
              <div className="mb-5 flex text-[#039147] md:mb-6">
                {"★★★★★".split("").map((star, index) => (
                  <span key={index}>{star}</span>
                ))}
              </div>

              <p className="flex-1 text-base leading-8 text-black/65 md:text-lg md:leading-9">
                “{quote}”
              </p>

              <div className="mt-auto flex items-center gap-4 pt-7 md:pt-8">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaf8f0] text-xs font-black text-[#039147] md:h-12 md:w-12 md:text-sm">
                  PML
                </div>

                <div>
                  <h3 className="text-base font-black leading-tight text-black">{name}</h3>
                  <p className="mt-1 text-sm font-bold leading-tight text-black/48">{role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-2 text-center text-xs font-bold text-black/40 md:hidden">
          Swipe to read testimonials
        </p>
      </div>
    </section>
  );
}
