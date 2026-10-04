import { Button, HStack, VStack } from "@roll-and-call/ui";

import { auditLogHref } from "@/shared/lib";
import type { KickImpact, UserDetail } from "@/shared/server";
import { AdminHeader, ServerLink } from "@/shared/ui";

import type { ActivityRole } from "../model/activity-role";
import { toCertRows } from "../model/to-cert-rows";
import { USER_DETAIL_TAB, type UserDetailTab } from "../model/user-detail-tab";
import type { Viewer } from "../model/viewer";
import { ActivityPanel } from "./activity-panel";
import { CertPanel } from "./cert-panel";
import { KickFailNotice } from "./kick-fail-notice";
import { MemoPanel } from "./memo-panel";
import { NoShowPanel } from "./no-show-panel";
import { UserActionDialogs } from "./user-action-dialogs";
import { UserActionsAside } from "./user-actions-aside";
import { UserDetailTabs } from "./user-detail-tabs";
import { UserStateCard } from "./user-state-card";

interface UserDetailViewProps {
  user: UserDetail;
  tab: UserDetailTab;
  role: ActivityRole;
  page?: string;
  guildId: string;
  viewer: Viewer;
  kickBlock: string | null;
  discordBanFailed: boolean;
  kickImpact: KickImpact | null;
}

export function UserDetailView({
  user,
  tab,
  role,
  page,
  guildId,
  viewer,
  kickBlock,
  discordBanFailed,
  kickImpact,
}: UserDetailViewProps) {
  const logHref = auditLogHref({ targetUserId: user.id });
  return (
    <>
      <AdminHeader
        title={user.nickname}
        trail={[{ href: "/users", label: "유저" }]}
        actions={
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            render={<ServerLink path={logHref} />}
          >
            활동 기록에서 보기
          </Button>
        }
        withAside
      />
      <HStack data-full-bleed align="stretch" className="flex-1">
        <VStack className="min-w-0 flex-1 px-center">
          {discordBanFailed ? (
            <div className="px-200 pt-200">
              <KickFailNotice userId={user.id} nickname={user.nickname} guildId={guildId} />
            </div>
          ) : null}
          <UserStateCard user={user} discordBanFailed={discordBanFailed} />
          <UserDetailTabs
            tab={tab}
            counts={{
              [USER_DETAIL_TAB.activity]: user.activities.length,
              [USER_DETAIL_TAB.cert]: toCertRows(user).length,
              [USER_DETAIL_TAB.noShow]: user.noShows.length,
              [USER_DETAIL_TAB.memo]: user.memos.length,
            }}
            activityPanel={<ActivityPanel activities={user.activities} role={role} page={page} />}
            certPanel={<CertPanel user={user} page={page} />}
            noShowPanel={<NoShowPanel noShows={user.noShows} page={page} />}
            memoPanel={
              <MemoPanel
                userId={user.id}
                nickname={user.nickname}
                memos={user.memos}
                viewer={viewer}
              />
            }
          />
        </VStack>
        <UserActionsAside user={user} tab={tab} kickBlock={kickBlock} />
      </HStack>
      <UserActionDialogs user={user} kickImpact={kickImpact} />
    </>
  );
}
