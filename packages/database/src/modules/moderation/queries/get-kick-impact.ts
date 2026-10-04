import { kickImpactOf, type KickImpact } from "#/modules/moderation/model/kick-impact-of";

import { loadMemberOngoing } from "./load-member-ongoing";

export type { KickImpact };

// 추방 모달의 영향 줄. 제재 페이지의 진행 중인 활동과 같은 범위(loadMemberOngoing)를 센다.
export async function getKickImpact({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<KickImpact> {
  return kickImpactOf(await loadMemberOngoing({ serverId, userId }));
}
