import type { LucideIcon } from "lucide-react";

interface NavIconProps {
  Icon: LucideIcon;
  dot?: string;
  // 하단 탭은 26px, 데스크톱 좌측 내비는 22px.
  size?: number;
}

export function NavIcon({ Icon, dot, size = 26 }: NavIconProps) {
  return (
    <span className="relative flex">
      <Icon size={size} strokeWidth={1.9} aria-hidden />
      {dot && (
        <span
          role="img"
          aria-label={dot}
          className="absolute -top-0.5 -right-1 size-2 rounded-full border-[1.5px] border-surface bg-danger-solid"
        />
      )}
    </span>
  );
}
