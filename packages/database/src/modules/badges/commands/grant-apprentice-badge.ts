import { BADGE_LADDER } from "#/modules/badges/model/badge-ladder";

import { grantSpecialBadge } from "./grant-special-badge";

// 튜토리얼 퀘스트 4개를 모두 깬 사람에게 견습 모험가를 준다.
export function grantApprenticeBadge({
  serverId,
  userId,
  earnedAt,
}: {
  serverId: string;
  userId: string;
  earnedAt: Date;
}) {
  return grantSpecialBadge({ serverId, userId, badgeKey: BADGE_LADDER.apprentice, earnedAt });
}
