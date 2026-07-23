type ContentBlockProps = {
  eyebrow: string;
  title: string;
  description: string;
  items?: string[];
};

export default function ContentBlock({
  eyebrow,
  title,
  description,
  items = [],
}: ContentBlockProps) {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="pml-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#039147]">
            {eyebrow}
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-black md:text-6xl">
            {title}
          </h2>

          <p className="mt-6 text-base leading-8 text-black/65">
            {description}
          </p>
        </div>

        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-start gap-4 rounded-[24px] border border-black/5 bg-[#f6faf7] p-5 shadow-sm"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eaf8f0] text-sm font-black text-[#039147]">
                ✓
              </span>
              <p className="text-base font-bold leading-8 text-black/65">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
