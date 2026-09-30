import { heldBadges } from "@/entities/badge";
import { getUserBadges } from "@/shared/server";

import { buildAwardSheet } from "../model/build-award-sheet";
import { BadgeAwardSheet } from "./badge-award-sheet";

interface BadgeAwardGateProps {
  userId: string;
}

// 알리지 않은 뱃지가 있을 때만 시트를 그린다. 홈이 Suspense로 감싸 달력을 막지 않는다.
export async function BadgeAwardGate({ userId }: BadgeAwardGateProps) {
  const sheet = buildAwardSheet(heldBadges(await getUserBadges(userId)));
  return sheet ? <BadgeAwardSheet sheet={sheet} /> : null;
}
