import { HStack, VStack } from "@roll-and-call/ui";

import type { UserDetail } from "@/entities/user/server";
import { AdminHeader, RouteTabs, TabCount } from "@/shared/ui";

import { toCertRows } from "../model/to-cert-rows";
import { USER_DETAIL_MOBILE_TABS } from "../model/user-detail-mobile-tabs";
import { USER_DETAIL_TAB, type UserDetailTab } from "../model/user-detail-tab";
import type { Viewer } from "../model/viewer";
import { KickFailNotice } from "./kick-fail-notice";
import { ActivityRows } from "./mobile/activity-rows";
import { CertRows } from "./mobile/cert-rows";
import { MemoList } from "./mobile/memo-list";
import { NoShowRows } from "./mobile/no-show-rows";
import { UserMobileActionBar } from "./mobile/user-mobile-action-bar";
import { UserSummaryCard } from "./mobile/user-summary-card";
import { SanctionCallout } from "./sanction-callout";
import { UnbanFailNotice } from "./unban-fail-notice";

interface UserDetailMobileViewProps {
  user: UserDetail;
  tab: UserDetailTab;
  guildId: string;
  viewer: Viewer;
  kickBlock: string | null;
  discordBanFailed: boolean;
  discordUnbanFailed: boolean;
}

// 조치 확인창은 데스크톱 View의 UserActionDialogs가 주소(action)를 보고 띄운다(모바일에선 시트).
export function UserDetailMobileView({
  user,
  tab,
  guildId,
  viewer,
  kickBlock,
  discordBanFailed,
  discordUnbanFailed,
}: UserDetailMobileViewProps) {
  const basePath = `/users/${user.id}`;
  const counts: Record<UserDetailTab, number> = {
    [USER_DETAIL_TAB.activity]: user.activities.length,
    [USER_DETAIL_TAB.cert]: toCertRows(user).length,
    [USER_DETAIL_TAB.noShow]: user.noShows.length,
    [USER_DETAIL_TAB.memo]: user.memos.length,
  };
  const hrefOf = (value: UserDetailTab) =>
    value === USER_DETAIL_TAB.activity ? basePath : `${basePath}?tab=${value}`;
  return (
    <>
      <AdminHeader title={user.nickname} trail={[{ href: "/users", label: "유저" }]} />
      <VStack gap="150" className="p-150">
        {discordBanFailed ? (
          <KickFailNotice userId={user.id} nickname={user.nickname} guildId={guildId} />
        ) : null}
        {discordUnbanFailed ? <UnbanFailNotice userId={user.id} guildId={guildId} /> : null}
        {user.sanction ? (
          <SanctionCallout
            sanction={user.sanction}
            nickname={user.nickname}
            pastSanctionCount={user.pastSanctionCount}
          />
        ) : null}
        <UserSummaryCard user={user} discordBanFailed={discordBanFailed} />
      </VStack>
      <RouteTabs
        label="유저 상세"
        value={hrefOf(tab)}
        items={USER_DETAIL_MOBILE_TABS.map(({ value, label }) => ({
          href: hrefOf(value),
          label: (
            <HStack align="center" gap="075" render={<span />}>
              {label}
              <TabCount count={counts[value]} selected={tab === value} />
            </HStack>
          ),
        }))}
      />
      {tab === USER_DETAIL_TAB.activity ? <ActivityRows activities={user.activities} /> : null}
      {tab === USER_DETAIL_TAB.cert ? <CertRows user={user} /> : null}
      {tab === USER_DETAIL_TAB.noShow ? <NoShowRows noShows={user.noShows} /> : null}
      {tab === USER_DETAIL_TAB.memo ? (
        <MemoList userId={user.id} nickname={user.nickname} memos={user.memos} viewer={viewer} />
      ) : null}
      <UserMobileActionBar user={user} tab={tab} kickBlock={kickBlock} />
    </>
  );
}
