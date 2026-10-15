import { BADGE_ROLE } from "@roll-and-call/database/badges/model";
import type { RankingMode } from "@roll-and-call/database/servers/model";
import { Container, VStack } from "@roll-and-call/ui";

import {
  BADGE_TAB,
  BADGE_TABS,
  countBadges,
  heldBadges,
  pickFeaturedBadges,
} from "@/entities/badge";
import { LoginRequired } from "@/features/auth";
import { serverPath } from "@/shared/lib";
import {
  getBadgeFacts,
  getCurrentSessionUser,
  getMonthlyAppearances,
  getProfile,
  getUserBadges,
  getCurrentServer,
} from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";
import { SessionTabs } from "@/widgets/session-list";

import { buildDexTab } from "../model/build-dex-tab";
import { dexTabKey } from "../model/dex-tab-key";
import { specialTitles } from "../model/special-titles";
import { DexHeader } from "./dex-header";
import { DexMonthlyCard } from "./dex-monthly-card";
import { DexRoleTab } from "./dex-role-tab";
import { DexSection } from "./dex-section";
import { DexSpecialTab } from "./dex-special-tab";

interface MyBadgesViewProps {
  tab: string | string[] | undefined;
}

export async function MyBadgesView({ tab }: MyBadgesViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  if (!user) {
    return (
      <PageShell appBar={<AppBar back="/me" title="업적 도감" />}>
        <VStack className="py-300 desktop:py-0">
          <LoginRequired />
        </VStack>
      </PageShell>
    );
  }

  const now = new Date();
  const [profile, records, facts, appearances] = await Promise.all([
    getProfile(server.id, user.id),
    getUserBadges(server.id, user.id),
    getBadgeFacts({ serverId: server.id, userId: user.id, now }),
    getMonthlyAppearances({ serverId: server.id, now }),
  ]);

  const held = heldBadges(records, now);
  const featured = pickFeaturedBadges({ featuredKeys: profile?.featuredBadges ?? [], held });
  const activeTab = dexTabKey(tab);
  const badgeCount = countBadges(records, now);
  const tabs = BADGE_TABS.map((badgeTab) => ({
    ...badgeTab,
    count: badgeCount[badgeTab.key],
    href: serverPath({ slug: server.slug, path: `/me/badges?tab=${badgeTab.key}` }),
  }));
  const role = activeTab === BADGE_TAB.gm ? BADGE_ROLE.gm : BADGE_ROLE.player;
  const board =
    activeTab === BADGE_TAB.special
      ? null
      : buildDexTab({
          role,
          records,
          facts,
          appearances,
          userId: user.id,
          now,
          mode: server.rankingMode as RankingMode,
        });

  return (
    <PageShell
      appBar={<AppBar back="/me" title="업적 도감" />}
      panel={
        <div className="overflow-clip rounded-700 border border-gray-200 bg-surface">
          <DexHeader earnedCount={badgeCount.total} featured={featured} />
          {board && (
            <DexSection title={board.monthly.title}>
              <DexMonthlyCard card={board.monthly} />
            </DexSection>
          )}
        </div>
      }
    >
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm" className="px-0 pb-300">
          <div className="desktop:hidden">
            <DexHeader earnedCount={badgeCount.total} featured={featured} />
          </div>
          <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) bg-surface desktop:static">
            <SessionTabs label="분류" tabs={tabs} activeKey={activeTab} />
          </div>
          {board ? (
            <DexRoleTab role={role} board={board} />
          ) : (
            <DexSpecialTab {...specialTitles({ held, records, now })} />
          )}
        </Container>
      </div>
    </PageShell>
  );
}
