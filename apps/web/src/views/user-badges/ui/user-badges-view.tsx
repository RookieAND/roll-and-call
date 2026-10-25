import { Container, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { notFound, redirect } from "next/navigation";

import { BADGE_TABS, countBadges, heldBadges } from "@/entities/badge";
import { DepartedMemberScreen } from "@/entities/profile";
import { serverPath } from "@/shared/lib";
import {
  getCurrentSessionUser,
  getProfile,
  getUserBadges,
  getCurrentServer,
} from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";
import { SessionTabs } from "@/widgets/session-list";

import { roleGroups } from "../model/role-groups";
import { userTabKey } from "../model/user-tab-key";
import { UserBadgeGroup } from "./user-badge-group";
import { UserBadgesEmpty } from "./user-badges-empty";

interface UserBadgesViewProps {
  id: string;
  tab: string | string[] | undefined;
}

export async function UserBadgesView({ id, tab }: UserBadgesViewProps) {
  const server = await getCurrentServer();
  const [viewer, profile] = await Promise.all([getCurrentSessionUser(), getProfile(server.id, id)]);
  if (viewer?.id === id) redirect(serverPath({ slug: server.slug, path: "/me/badges" }));
  if (!profile) notFound();
  if (!isNull(profile.deletedAt)) {
    return <DepartedMemberScreen name={profile.username} avatarUrl={profile.avatarUrl} />;
  }

  const title = `${profile.username}의 업적`;
  const back = `/users/${id}`;
  const now = new Date();
  const records = await getUserBadges(server.id, id);
  const held = heldBadges(records, now);
  const counts = countBadges(records, now);
  const activeTab = userTabKey({ tab, counts });
  const tabs = BADGE_TABS.map((badgeTab) => ({
    ...badgeTab,
    count: counts[badgeTab.key],
    href: serverPath({ slug: server.slug, path: `/users/${id}/badges?tab=${badgeTab.key}` }),
  }));
  const groups = roleGroups({ tab: activeTab, held, records, now });

  return (
    <PageShell
      appBar={
        <AppBar
          back={back}
          title={title}
          action={
            <Text typography="body3" foreground="hint" numeric className="pr-125">
              {counts.total}개
            </Text>
          }
        />
      }
    >
      <div className={DESKTOP_CARD_CLASS}>
        <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) bg-surface desktop:static">
          <Container size="sm" className="px-0 desktop:max-w-none">
            <SessionTabs label="분류" tabs={tabs} activeKey={activeTab} />
          </Container>
        </div>
        <Container size="sm" className="pb-250 desktop:max-w-none">
          {groups.length > 0 ? (
            groups.map((group) => <UserBadgeGroup key={group.key} group={group} />)
          ) : (
            <UserBadgesEmpty tab={activeTab} />
          )}
        </Container>
      </div>
    </PageShell>
  );
}
