"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  ["20", "+", "years experience"],
  ["6000", "+", "completed projects"],
  ["300", "+", "sponsors"],
  ["190", "+", "validated bioanalytical method"],
];

function CountUp({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const target = Number(value);
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;

        const duration = 1400;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(target * eased));

          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="text-3xl font-black tracking-[-0.04em] text-[#039147] md:text-5xl"
    >
      {display.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function Stats() {
  return (
    <section className="pml-home-stats relative z-20 -mt-10 px-4 md:-mt-14">
      <div className="pml-home-stats-grid pml-container grid grid-cols-2 gap-3 rounded-[28px] bg-white p-3 shadow-[0_24px_90px_rgba(0,0,0,0.14)] md:grid-cols-4 md:gap-4 md:rounded-[32px] md:p-4">
        {stats.map(([value, suffix, label]) => (
          <div
            key={label}
            className="pml-home-stat-card flex min-h-[130px] flex-col items-center justify-center rounded-[22px] border border-black/5 bg-[#f6faf7] p-4 text-center md:min-h-[170px] md:rounded-[24px] md:p-7"
          >
            <CountUp value={value} suffix={suffix} />
            <div className="mt-3 text-[10px] font-black uppercase leading-4 tracking-[0.10em] text-black/45 md:text-xs">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
