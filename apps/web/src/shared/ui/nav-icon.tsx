import type { LucideIcon } from "lucide-react";

import { navBadgeCountLabel } from "./nav-badge-count-label";

interface NavIconProps {
  Icon: LucideIcon;
  // 점(또는 숫자 뱃지)의 이름. 없으면 아무것도 그리지 않는다.
  dot?: string;
  // 있고 0보다 크면 점 대신 숫자 알약을 그린다.
  count?: number;
  // 하단 탭은 26px, 데스크톱 좌측 내비는 22px.
  size?: number;
}

export function NavIcon({ Icon, dot, count, size = 26 }: NavIconProps) {
  return (
    <span className="relative flex">
      <Icon size={size} strokeWidth={1.9} aria-hidden />
      {dot &&
        (count ? (
          <span
            role="img"
            aria-label={`${dot} ${count}`}
            className="absolute -top-[7px] left-[55%] flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-solid px-050 text-body5 font-extrabold tabular-nums text-on-primary ring-2 ring-surface"
          >
            {navBadgeCountLabel(count)}
          </span>
        ) : (
          <span
            role="img"
            aria-label={dot}
            className="absolute -top-0.5 -right-1 size-2 rounded-full border-[1.5px] border-surface bg-danger-solid"
          />
        ))}
    </span>
  );
}
