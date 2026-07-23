type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      <p className={`text-sm font-black uppercase tracking-[0.18em] ${dark ? "text-white/75" : "text-[#039147]"}`}>
        {eyebrow}
      </p>

      <h2 className={`mt-4 text-4xl font-black leading-tight tracking-[-0.04em] md:text-6xl ${dark ? "text-white" : "text-black"}`}>
        {title}
      </h2>

      {description ? (
        <p className={`mt-6 text-base leading-8 md:text-lg ${dark ? "text-white/70" : "text-black/60"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
