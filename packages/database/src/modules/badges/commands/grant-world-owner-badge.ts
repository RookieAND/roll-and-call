import { BADGE_LADDER } from "#db/modules/badges/model/badge-ladder";

import { grantSpecialBadge } from "./grant-special-badge";

// 자작 룰이 승인된 제작자에게 세계의 주인을 준다. 이미 있으면 다시 주지 않고, 룰을 숨기거나 범위를 바꿔도 회수하지 않는다.
export function grantWorldOwnerBadge({ serverId, userId }: { serverId: string; userId: string }) {
  return grantSpecialBadge({ serverId, userId, badgeKey: BADGE_LADDER.worldOwner });
}
