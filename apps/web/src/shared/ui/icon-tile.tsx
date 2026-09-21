import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

const iconTile = cva("flex h-[34px] w-[34px] flex-none items-center justify-center rounded-400", {
  variants: {
    tone: {
      primary: "bg-primary-50 text-primary-ink",
      success: "bg-success-50 text-success-700",
      danger: "bg-danger-50 text-danger-600",
      muted: "bg-gray-100 text-gray-600",
      locked: "bg-gray-100 text-gray-400",
    },
  },
});

interface IconTileProps extends Required<VariantProps<typeof iconTile>> {
  icon: LucideIcon;
}

// 설정 줄·안내 블록 왼쪽에 붙는 34px 아이콘 칸.
export function IconTile({ icon: Icon, tone }: IconTileProps) {
  return (
    <span className={iconTile({ tone })}>
      <Icon size={18} aria-hidden />
    </span>
  );
}
