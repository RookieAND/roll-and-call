import { isNull } from "es-toolkit";
import { after } from "next/server";

import { heldBadges } from "@/entities/badge";
import { getCurrentServer, getUserBadges, markBadgesNotified } from "@/shared/server";

import { buildAwardSheet } from "../model/build-award-sheet";
import { BadgeAwardSheet } from "./badge-award-sheet";

interface BadgeAwardGateProps {
  userId: string;
}

// 시트를 띄우지 않는 대기 뱃지(단계 오름 등, 배포 전에 쌓인 것)는 알린 것으로 적는다.
export async function BadgeAwardGate({ userId }: BadgeAwardGateProps) {
  const server = await getCurrentServer();
  const records = await getUserBadges(server.id, userId);
  const sheet = buildAwardSheet(heldBadges(records));
  if (sheet) return <BadgeAwardSheet sheet={sheet} />;
  const pendingKeys = records
    .filter((record) => isNull(record.notifiedAt))
    .map((record) => record.badgeKey);
  if (pendingKeys.length > 0) {
    after(() => markBadgesNotified({ serverId: server.id, userId, badgeKeys: pendingKeys }));
  }
  return null;
}
