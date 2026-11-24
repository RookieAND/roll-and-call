import { BADGE_ROLE } from "@roll-and-call/database/badges/model";
import { cn, HStack, Text } from "@roll-and-call/ui";

import { MEDAL_ROLE_LABEL } from "../model/month-medal-label";
import type { UsersListItem } from "../model/users-list-item";

interface UserMonthRibbonsProps {
  medals: UsersListItem["medals"];
  size: "md" | "sm";
}

const RANK_COLOR = {
  1: "bg-[linear-gradient(to_bottom,var(--ribbon-gold-from),var(--ribbon-gold-to))] text-[var(--ribbon-gold-ink)] ribbon-shine",
  2: "bg-[linear-gradient(to_bottom,var(--ribbon-silver-from),var(--ribbon-silver-to))] text-[var(--ribbon-silver-ink)]",
  3: "bg-[linear-gradient(to_bottom,var(--ribbon-bronze-from),var(--ribbon-bronze-to))] text-[var(--ribbon-bronze-ink)]",
} as const;

const SIZE = {
  md: { wrapper: "right-[14px]", ribbon: "h-[46px] w-[34px] pt-050", rank: "subtitle1" },
  sm: { wrapper: "right-[12px]", ribbon: "h-[40px] w-[30px] pt-050", rank: "subtitle2" },
} as const;

// ponytail: 디자인 시스템에 리본이 없어 모양만 직접 그린다. 글씨는 Text, 배치는 HStack을 쓴다.
// 이달의 기록 1~3위. 카드 오른쪽 위 모서리에 걸리고, PL을 먼저 놓아 GM이 가장 바깥(오른쪽)에 온다.
export function UserMonthRibbons({ medals, size }: UserMonthRibbonsProps) {
  if (medals.length === 0) return null;
  const look = SIZE[size];
  const ordered = medals.toSorted(
    (a, b) => Number(a.role === BADGE_ROLE.gm) - Number(b.role === BADGE_ROLE.gm),
  );
  return (
    <HStack
      gap="050"
      className={cn(
        "absolute top-0 z-10 drop-shadow-[0_1px_1.5px_var(--ribbon-shadow)]",
        look.wrapper,
      )}
    >
      {ordered.map(({ role, rank }) => {
        const label = `이달의 ${MEDAL_ROLE_LABEL[role]} ${rank}위`;
        return (
          <span
            key={role}
            role="img"
            aria-label={label}
            title={label}
            className={cn(
              "relative flex flex-col items-center overflow-hidden leading-none [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]",
              look.ribbon,
              RANK_COLOR[rank],
            )}
          >
            <Text
              typography="body5"
              weight="extrabold"
              foreground="inherit"
              tight
              className="tracking-[0.04em]"
            >
              {MEDAL_ROLE_LABEL[role]}
            </Text>
            <Text
              typography={look.rank}
              foreground="inherit"
              numeric
              tight
              className="mt-025 font-black"
            >
              {rank}위
            </Text>
          </span>
        );
      })}
    </HStack>
  );
}
