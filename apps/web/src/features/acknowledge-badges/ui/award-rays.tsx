interface AwardRaysProps {
  gold: boolean;
}

export function AwardRays({ gold }: AwardRaysProps) {
  const color = gold ? "var(--color-warning-50)" : "var(--color-primary-50)";
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-1/2 left-1/2 -mt-40 -ml-40 size-80 rounded-full animate-badge-rays"
      style={{ background: `repeating-conic-gradient(${color} 0deg 9deg, transparent 9deg 18deg)` }}
    />
  );
}
