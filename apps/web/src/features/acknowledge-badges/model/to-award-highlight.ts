import { badgeRequirement } from "@/entities/badge";
import { toKst } from "@/shared/lib";

import type { AwardHighlight } from "./award-sheet";
import type { HeldBadge } from "./held-badge";
import { toAwardItem } from "./to-award-item";

// 숨겨진 칭호는 조건 대신 설명 한 줄, 첫 뱃지는 기준 한 줄과 채운 세션 링크를 보인다.
export function toAwardHighlight(badge: HeldBadge): AwardHighlight {
  const source = badge.record.source;
  return {
    ...toAwardItem(badge),
    line: badgeRequirement({
      ladder: badge.ladder,
      step: badge.step,
      categoryName: badge.categoryName,
    }),
    source: source && {
      label: `${source.title} · ${toKst(source.startsAt).format("M월 D일")} 세션`,
      href: `/games/${source.gameId}`,
    },
  };
}
