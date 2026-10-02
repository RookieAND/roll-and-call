const DOTS_MASK = "radial-gradient(120% 70% at 50% 30%, black 30%, transparent 80%)";

export function JoinBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute -left-[60px] top-[40px] size-[240px] animate-join-blob-a rounded-full bg-primary-600 opacity-22 blur-[48px]" />
      <span className="absolute -right-[70px] top-[150px] size-[220px] animate-join-blob-b rounded-full bg-discord opacity-20 blur-[48px]" />
      <span
        className="absolute inset-0 animate-join-dots bg-[size:22px_22px]"
        style={{
          backgroundImage: "radial-gradient(var(--rc-color-border-strong) 1px, transparent 1.2px)",
          maskImage: DOTS_MASK,
        }}
      />
      <span
        className="absolute top-[250px] left-1/2 size-[300px] -translate-1/2 rounded-full opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, var(--rc-color-bg-canvas-base), transparent)",
        }}
      />
    </div>
  );
}
