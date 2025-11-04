"use client";

import { useEffect, useRef, useState } from "react";

function CountUp({ to, duration = 1500 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            setValue(Math.round(to * progress));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.6 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [duration, started, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString()}
    </span>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        rounded-xl border border-border bg-card text-card-foreground
        p-6 flex flex-col gap-2 items-start
        animate-in fade-in slide-in-from-bottom duration-700
      "
    >
      <div className="text-3xl md:text-4xl font-semibold">
        <CountUp to={value} />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default function StatisticCards() {
  // Demo targets; replace with live metrics when available
  const stats = [
    { label: "Posts Created", value: 3500 },
    { label: "Items Resolved", value: 780 },
    { label: "Active Subscribers", value: 1200 },
  ];

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Community Impact</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </div>
  );
}
