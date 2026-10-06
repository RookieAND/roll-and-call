import { BADGE_ROLE } from "@roll-and-call/database/badges/model";
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
import { AppBar } from "@/shared/ui";
import { SessionTabs } from "@/widgets/session-list";

import { buildDexTab } from "../model/build-dex-tab";
import { dexTabKey } from "../model/dex-tab-key";
import { roleTitles } from "../model/role-titles";
import { specialTitles } from "../model/special-titles";
import { DexHeader } from "./dex-header";
import { DexRoleTab } from "./dex-role-tab";
import { DexSpecialTab } from "./dex-special-tab";

interface MyBadgesViewProps {
  tab: string | string[] | undefined;
}

export async function MyBadgesView({ tab }: MyBadgesViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
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

  return (
    <>
      <AppBar back="/me" title="업적 도감" />
      <Container size="sm" className="px-0 pb-300">
        <DexHeader earnedCount={badgeCount.total} featured={featured} />
        <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) bg-surface">
          <SessionTabs label="분류" tabs={tabs} activeKey={activeTab} />
        </div>
        {activeTab === BADGE_TAB.special ? (
          <DexSpecialTab {...specialTitles({ held, records, now })} />
        ) : (
          <DexRoleTab
            role={role}
            titles={role === BADGE_ROLE.gm ? roleTitles({ held, records, now }) : []}
            board={buildDexTab({ role, records, facts, appearances, userId: user.id, now })}
          />
        )}
      </Container>
    </>
  );
}
