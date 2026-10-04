import { BADGE_ROLE, kstMonthKey } from "@roll-and-call/database/badges/model";

import {
  badgeCounts,
  countBadges,
  currentMonthStanding,
  monthLabel,
  nextBadgeGoal,
} from "@/entities/badge";
import { CERT_STATE } from "@/entities/rulebook";
import {
  getCurrentSessionUser,
  getUserBadges,
  getCurrentServer,
  getMonthlyAppearances,
} from "@/shared/server";

import { loadMyBadgeFacts } from "../api/load-my-badge-facts";
import { loadMyPageSessions } from "../api/load-my-page-sessions";
import { loadMyRulebooks } from "../api/load-my-rulebooks";
import { MyPageBadges } from "./my-page-badges";

// 이번 달 줄은 도감 이달의 카드와 같은 값이다. GM 줄은 구인을 연 적이 있거나 인증한 판본이 있을 때만(R18).
export async function MyPageBadgesSection() {
  const user = (await getCurrentSessionUser())!;
  const server = await getCurrentServer();
  const now = new Date();
  const [records, facts, appearances, { hosted }, { rulebooks }] = await Promise.all([
    getUserBadges(server.id, user.id),
    loadMyBadgeFacts(user.id),
    getMonthlyAppearances({ serverId: server.id, now }),
    loadMyPageSessions(server.id, user.id),
    loadMyRulebooks(user.id),
  ]);
  const month = monthLabel(kstMonthKey(now));
  const standingLine = (role: typeof BADGE_ROLE.gm | typeof BADGE_ROLE.player) => {
    const { count, topCount } = currentMonthStanding({ appearances, userId: user.id, role, now });
    const label = role === BADGE_ROLE.gm ? "GM 진행" : "PL 참여";
    return `${month} ${label} ${count}회 · 1위 ${topCount}회`;
  };
  const showsGm =
    hosted.length > 0 || rulebooks.some((rulebook) => rulebook.state === CERT_STATE.certified);
  const heldCount = countBadges(records, now).total;

  return (
    <MyPageBadges
      heldCount={heldCount}
      goal={nextBadgeGoal(badgeCounts(facts))}
      monthLines={[
        standingLine(BADGE_ROLE.player),
        ...(showsGm ? [standingLine(BADGE_ROLE.gm)] : []),
      ]}
    />
  );
}
