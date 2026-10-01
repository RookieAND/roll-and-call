import { heldBadges } from "@/entities/badge";
import { getUserBadges } from "@/shared/server";

import { buildAwardSheet } from "../model/build-award-sheet";
import { BadgeAwardSheet } from "./badge-award-sheet";

interface BadgeAwardGateProps {
  userId: string;
}

export async function BadgeAwardGate({ userId }: BadgeAwardGateProps) {
  const sheet = buildAwardSheet(heldBadges(await getUserBadges(userId)));
  return sheet ? <BadgeAwardSheet sheet={sheet} /> : null;
}
