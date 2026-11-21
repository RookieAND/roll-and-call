import { Badge, HStack } from "@roll-and-call/ui";

import { MEDAL_EMOJI, MEDAL_ROLE_LABEL } from "../model/month-medal-label";
import type { UsersListItem } from "../model/users-list-item";

interface UserMonthMedalsProps {
  medals: UsersListItem["medals"];
}

// 이달의 기록 1~3위 메달. 줄어들지 않게 두어 이름·칭호가 먼저 잘리게 한다.
export function UserMonthMedals({ medals }: UserMonthMedalsProps) {
  if (medals.length === 0) return null;
  return (
    <HStack align="center" gap="050" className="flex-none">
      {medals.map(({ role, rank }) => {
        const label = `이달의 ${MEDAL_ROLE_LABEL[role]} ${rank}위`;
        return (
          <Badge key={role} colorPalette="gray" role="img" aria-label={label} title={label}>
            <span aria-hidden>
              {MEDAL_ROLE_LABEL[role]} {MEDAL_EMOJI[rank]}
            </span>
          </Badge>
        );
      })}
    </HStack>
  );
}
