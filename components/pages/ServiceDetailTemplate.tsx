import ServiceHero from "./ServiceHero";
import ContentBlock from "./ContentBlock";
import OtherServices from "@/components/OtherServices";
import CTACard from "@/components/ui/CTACard";
import { ServicePageData } from "@/data/service-pages";

type ServiceDetailTemplateProps = {
  data: ServicePageData;
};

export default function ServiceDetailTemplate({ data }: ServiceDetailTemplateProps) {
  return (
    <main>
      <ServiceHero
        eyebrow={data.eyebrow}
        title={data.title}
        description={data.description}
        image={data.image}
      />

      <ContentBlock
        eyebrow="Service Overview"
        title={data.overviewTitle}
        description={data.overview}
        items={data.scope}
      />

      <section className="bg-[#f6faf7] py-20 md:py-28">
        <div className="pml-container grid gap-8 lg:grid-cols-2">
          <div className="rounded-[34px] bg-white p-8 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#039147]">
              Key Benefits
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-black">
              Built for sponsor clarity and execution
            </h2>

            <div className="mt-8 grid gap-4">
              {data.benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-4 rounded-2xl bg-[#f6faf7] p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eaf8f0] text-sm font-black text-[#039147]">
                    ✓
                  </span>
                  <p className="text-base font-bold leading-8 text-black/65">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] bg-white p-8 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#039147]">
              Process / Workflow
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-black">
              Structured project workflow
            </h2>

            <div className="mt-8 grid gap-4">
              {data.workflow.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl bg-[#f6faf7] p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#039147] text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-base font-bold leading-8 text-black/65">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="pml-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#039147]">
              Related FAQ
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-black md:text-5xl">
              Common questions about this service
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {data.faq.map(([question, answer]) => (
              <details key={question} className="group rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <h3 className="text-base font-black leading-6 text-black md:text-lg">{question}</h3>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaf8f0] text-xl font-black text-[#039147] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-5 max-w-3xl text-base leading-8 text-black/65 md:text-base">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <OtherServices current={data.key} variant="three" />
      <CTACard />
    </main>
  );
}
