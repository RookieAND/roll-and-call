import { HStack, VStack } from "@roll-and-call/ui";

import type { UserDetail } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

import type { ActivityRole } from "../model/activity-role";
import type { UserDetailTab } from "../model/user-detail-tab";
import { ActivityPanel } from "./activity-panel";
import { CertPanel } from "./cert-panel";
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
}

export function UserDetailView({ user, tab, role }: UserDetailViewProps) {
  return (
    <>
      <AdminHeader
        title={user.nickname}
        sub="유저 상세"
        back={{ href: "/users", label: "유저 목록" }}
      />
      <HStack align="stretch" className="flex-1">
        <VStack className="min-w-0 flex-1 bg-gray-50">
          <UserStateCard user={user} />
          <UserDetailTabs
            tab={tab}
            activityPanel={<ActivityPanel activities={user.activities} role={role} />}
            certPanel={<CertPanel user={user} />}
            noShowPanel={<NoShowPanel nickname={user.nickname} noShows={user.noShows} />}
            memoPanel={<MemoPanel userId={user.id} memos={user.memos} />}
          />
        </VStack>
        <UserActionsAside user={user} tab={tab} />
      </HStack>
      <UserActionDialogs user={user} />
    </>
  );
}
