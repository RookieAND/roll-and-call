import { Container, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { Lock } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { BADGE_TAB, BADGE_TABS, badgeTabOf, heldBadges } from "@/entities/badge";
import { DepartedMemberScreen } from "@/entities/profile";
import { serverPath } from "@/shared/lib";
import {
  getCurrentSessionUser,
  getProfile,
  getUserBadges,
  getCurrentServer,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { SessionTabs } from "@/widgets/session-list";

import { roleGroups } from "../model/role-groups";
import { userTabKey } from "../model/user-tab-key";
import { UserBadgeGroup } from "./user-badge-group";

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
  if (!profile.showBadges) {
    return (
      <>
        <AppBar back={back} title={title} />
        <VStack align="center" gap="100" className="px-300 pt-500 pb-600 text-center">
          <span className="flex size-16 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-canvas text-hint">
            <Lock size={24} aria-hidden />
          </span>
          <Text typography="subtitle1">업적을 공개하지 않았습니다</Text>
          <Text typography="body3" foreground="muted">
            프로필 주인이 업적을 숨겨 두었습니다.
          </Text>
        </VStack>
      </>
    );
  }

  const now = new Date();
  const records = await getUserBadges(server.id, id);
  const held = heldBadges(records, now);
  const countOf = (key: string) => held.filter((badge) => badgeTabOf(badge) === key).length;
  const counts = {
    [BADGE_TAB.gm]: countOf(BADGE_TAB.gm),
    [BADGE_TAB.player]: countOf(BADGE_TAB.player),
    [BADGE_TAB.special]: countOf(BADGE_TAB.special),
  };
  const activeTab = userTabKey({ tab, counts });
  const tabs = BADGE_TABS.map((badgeTab) => ({
    ...badgeTab,
    count: counts[badgeTab.key],
    href: serverPath({ slug: server.slug, path: `/users/${id}/badges?tab=${badgeTab.key}` }),
  }));
  const groups = roleGroups({ tab: activeTab, held, records, now });
  const emptyText =
    activeTab === BADGE_TAB.special
      ? "아직 받은 특별 업적이 없습니다"
      : "아직 받은 뱃지가 없습니다";

  return (
    <>
      <AppBar
        back={back}
        title={title}
        action={
          <Text typography="body3" foreground="hint" numeric className="pr-125">
            {held.length}개
          </Text>
        }
      />
      <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) bg-surface">
        <Container size="sm" className="px-0">
          <SessionTabs label="분류" tabs={tabs} activeKey={activeTab} />
        </Container>
      </div>
      <Container size="sm" className="pb-250">
        {groups.length > 0 ? (
          groups.map((group) => <UserBadgeGroup key={group.key} group={group} />)
        ) : (
          <Text typography="body3" foreground="hint" className="py-300 text-center">
            {emptyText}
          </Text>
        )}
      </Container>
    </>
  );
}
