import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

const tile = cva("grid shrink-0 place-items-center", {
  variants: {
    tone: {
      gray: "bg-gray-100 text-gray-600",
      primary: "bg-tinted-bg text-tinted-ink",
      success: "bg-success-50 text-success-600",
      danger: "bg-danger-50 text-danger-600",
      warning: "bg-warning-50 text-warning-600",
    },
    size: {
      sm: "size-[26px] rounded-300",
      md: "size-[28px] rounded-400",
      lg: "size-[30px] rounded-400",
      xl: "size-[40px] rounded-400",
    },
  },
  defaultVariants: { tone: "gray", size: "md" },
});

const ICON_SIZE = { sm: 14, md: 16, lg: 18, xl: 20 } as const;

interface IconTileProps extends VariantProps<typeof tile> {
  icon: LucideIcon;
}

export function IconTile({ icon: Icon, tone, size = "md" }: IconTileProps) {
  return (
    <span className={tile({ tone, size })} aria-hidden>
      <Icon size={ICON_SIZE[size ?? "md"]} />
    </span>
  );
}
