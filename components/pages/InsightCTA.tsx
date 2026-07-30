type InsightCTAProps = {
  locale: "en" | "id";
};


export default function InsightCTA({
  locale,
}: InsightCTAProps) {


  return (

    <section className="pml-container py-20">


      <div className="overflow-hidden rounded-[40px] bg-black px-8 py-14 text-white md:px-16">


        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
          Pharma Metric Labs
        </p>


        <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
          {locale === "id"
            ? "Siap mendiskusikan kebutuhan proyek Anda?"
            : "Ready to discuss your pharmaceutical project?"}
        </h2>


        <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
          {locale === "id"
            ? "Tim PML siap membantu kebutuhan studi klinis, analisis laboratorium, dan layanan CRO."
            : "The PML team is ready to support your clinical, analytical, and CRO service requirements."}
        </p>


        <button
          className="mt-8 rounded-full bg-white px-8 py-4 text-sm font-black text-black transition hover:bg-[#039147] hover:text-white"
        >
          {locale === "id"
            ? "Ajukan Proposal"
            : "Request Proposal"}
        </button>


      </div>


    </section>

  );
}
