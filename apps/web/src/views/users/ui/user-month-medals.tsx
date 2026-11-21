import { HStack } from "@roll-and-call/ui";

import { BadgePill } from "@/entities/badge";

import { MEDAL_EMOJI, MEDAL_LOOK, MEDAL_ROLE_LABEL } from "../model/month-medal-label";
import type { UsersListItem } from "../model/users-list-item";

interface UserMonthMedalsProps {
  medals: UsersListItem["medals"];
  size: "xs" | "sm";
}

// 이달의 기록 1~3위 메달. 칭호 알약과 같은 금·은·동 모양이고, 줄어들지 않게 두어 이름·칭호가 먼저 잘리게 한다.
export function UserMonthMedals({ medals, size }: UserMonthMedalsProps) {
  if (medals.length === 0) return null;
  return (
    <HStack align="center" gap="050" className="flex-none">
      {medals.map(({ role, rank, month }) => {
        const label = `${month} ${MEDAL_ROLE_LABEL[role]} ${rank}위`;
        return (
          <span key={role} role="img" aria-label={label} title={label} className="flex">
            <BadgePill
              emoji={MEDAL_EMOJI[rank]}
              name={MEDAL_ROLE_LABEL[role]}
              look={MEDAL_LOOK[rank]}
              tag={month}
              size={size}
            />
          </span>
        );
      })}
    </HStack>
  );
}
