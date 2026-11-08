import { Container } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { notFound, redirect } from "next/navigation";

import { SESSION_ROLE } from "@/entities/game";
import { DepartedMemberScreen } from "@/entities/profile";
import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getCurrentServer } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";
import {
  countableCards,
  PROFILE_SESSION_SECTIONS,
  SessionList,
  SessionTabs,
  userSessionsHref,
} from "@/widgets/session-list";
import { loadProfile } from "@/widgets/session-list/server";

import { UserSessionsEmptyCard } from "./user-sessions-empty-card";
import { UserSessionsProfilePanel } from "./user-sessions-profile-panel";

const EMPTY_IMAGE = {
  [SESSION_ROLE.player]: "empty-my-games",
  [SESSION_ROLE.host]: "empty-hosted",
} as const;

interface UserSessionsViewProps {
  id: string;
  tab?: string;
}

export async function UserSessionsView({ id, tab }: UserSessionsViewProps) {
  const server = await getCurrentServer();
  const viewer = await getCurrentSessionUser();
  if (viewer?.id === id) redirect(serverPath({ slug: server.slug, path: "/me/sessions" }));
  const loaded = await loadProfile({ userId: id, viewerId: viewer?.id ?? null });
  if (!loaded) notFound();

  const { profile, sessions } = loaded;
  if (!isNull(profile.deletedAt)) {
    return <DepartedMemberScreen name={profile.username} avatarUrl={profile.avatarUrl} />;
  }
  // ?tab=host만 운영 탭이고, 옛 ?tab=player와 모르는 값은 기본인 참여 탭이다(R23).
  const activeKey = tab === SESSION_ROLE.host ? SESSION_ROLE.host : SESSION_ROLE.player;
  const activeSection = PROFILE_SESSION_SECTIONS.find((section) => section.key === activeKey)!;
  const items = sessions[activeSection.key];
  const tabs = PROFILE_SESSION_SECTIONS.map((section) => ({
    key: section.key,
    label: section.title,
    // 탭 숫자는 숨김 카드와 취소된 구인을 뺀 수다(시안 05-5 유의 사항 2).
    count: countableCards(sessions[section.key]).filter((card) => !card.hidden).length,
    href: serverPath({
      slug: server.slug,
      path: userSessionsHref({ userId: profile.id, role: section.key }),
    }),
  }));

  return (
    <PageShell
      panel={<UserSessionsProfilePanel profile={profile} />}
      appBar={<AppBar back={`/users/${profile.id}`} title={`${profile.username}의 세션`} />}
    >
      <div className={DESKTOP_CARD_CLASS}>
        <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) bg-surface desktop:static">
          <SessionTabs label="세션 기록" tabs={tabs} activeKey={activeSection.key} />
        </div>
        <Container size="sm" className="desktop:max-w-none">
          <div className="py-250">
            {items.length > 0 ? (
              <SessionList items={items} />
            ) : (
              <UserSessionsEmptyCard
                image={EMPTY_IMAGE[activeSection.key]}
                title={activeSection.empty}
              />
            )}
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
