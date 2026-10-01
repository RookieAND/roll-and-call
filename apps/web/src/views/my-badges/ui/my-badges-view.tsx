import { BADGE_ROLE } from "@roll-and-call/database/rules";
import { Container, VStack } from "@roll-and-call/ui";
import { after } from "next/server";

import { heldBadges, pickFeaturedBadges } from "@/entities/badge";
import { LoginRequired } from "@/features/auth";
import {
  getBadgeFacts,
  getCurrentSessionUser,
  getMonthlyAppearances,
  getProfile,
  getUserBadges,
  markBadgesSeen,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { SessionTabs } from "@/widgets/session-list";

import { buildDexTab } from "../model/build-dex-tab";
import { dexTabKey } from "../model/dex-tab-key";
import { DexGridSection } from "./dex-grid-section";
import { DexHeader } from "./dex-header";
import { DexLadderTrack } from "./dex-ladder-track";
import { DexMonthlyCard } from "./dex-monthly-card";
import { DexNextCard } from "./dex-next-card";
import { DexRuleList } from "./dex-rule-list";
import { DexSection } from "./dex-section";

interface MyBadgesViewProps {
  tab: string | string[] | undefined;
}

export async function MyBadgesView({ tab }: MyBadgesViewProps) {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me" title="업적 도감" />
        <VStack className="py-300">
          <LoginRequired />
        </VStack>
      </>
    );
  }

  const now = new Date();
  const [profile, records, facts, appearances] = await Promise.all([
    getProfile(user.id),
    getUserBadges(user.id),
    getBadgeFacts(user.id, now),
    getMonthlyAppearances(now),
  ]);
  after(() => markBadgesSeen(user.id));

  const held = heldBadges(records, now);
  const featured = pickFeaturedBadges(profile?.featuredBadges ?? [], held);
  const role = dexTabKey(tab);
  const board = buildDexTab({ role, records, facts, appearances, userId: user.id, now });
  const countOf = (target: string) => held.filter((badge) => badge.role === target).length;
  const tabs = [
    {
      key: BADGE_ROLE.player,
      label: "PL 참여",
      count: countOf(BADGE_ROLE.player),
      href: "/me/badges",
    },
    {
      key: BADGE_ROLE.gm,
      label: "GM 운영",
      count: countOf(BADGE_ROLE.gm),
      href: "/me/badges?tab=gm",
    },
  ];
  const ruleEmpty =
    role === BADGE_ROLE.gm
      ? "룰북이 연결된 구인을 운영하면 룰별 뱃지가 생깁니다"
      : "룰북이 연결된 세션에 참석하면 룰별 뱃지가 생깁니다";

  return (
    <>
      <AppBar back="/me" title="업적 도감" />
      <Container size="sm" className="px-0 pb-300">
        <DexHeader earnedCount={held.length} featured={featured} />
        <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) bg-surface">
          <SessionTabs label="분류" tabs={tabs} activeKey={role} />
        </div>

        <DexSection title={board.total.title} hint={board.total.hint}>
          <DexLadderTrack total={board.total} />
          <DexNextCard next={board.total.next} />
        </DexSection>

        <DexSection title={board.rules.title}>
          <DexRuleList rows={board.rules.rows} emptyText={ruleEmpty} />
        </DexSection>

        {board.variety && <DexGridSection board={board.variety} />}
        <DexGridSection board={board.reviews} />

        <DexSection title={board.monthly.title}>
          <DexMonthlyCard card={board.monthly} />
        </DexSection>
      </Container>
    </>
  );
}
