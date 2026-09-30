import { cva } from "class-variance-authority";

const sparkles = cva("pointer-events-none absolute", {
  variants: { size: { sm: "-inset-[7px]", lg: "-inset-[14px]" } },
});

const star = cva("absolute animate-badge-twinkle leading-none text-rank-gold", {
  variants: {
    size: { sm: "", lg: "" },
    small: { true: "", false: "" },
  },
  compoundVariants: [
    { size: "sm", small: false, className: "text-body4" },
    { size: "sm", small: true, className: "text-body5" },
    { size: "lg", small: false, className: "text-heading2" },
    { size: "lg", small: true, className: "text-subtitle2" },
  ],
});

const STARS = [
  "top-0 left-[6%] [animation-delay:0s]",
  "top-[8%] right-0 [animation-delay:0.65s]",
  "right-[12%] bottom-[2%] [animation-delay:1.3s]",
  "bottom-[16%] left-0 [animation-delay:1.95s]",
] as const;

interface BadgeSparklesProps {
  size: "sm" | "lg";
}

export function BadgeSparkles({ size }: BadgeSparklesProps) {
  return (
    <span aria-hidden className={sparkles({ size })}>
      {STARS.map((position, index) => (
        <span key={position} className={`${star({ size, small: index % 2 === 1 })} ${position}`}>
          ✦
        </span>
      ))}
    </span>
  );
}
