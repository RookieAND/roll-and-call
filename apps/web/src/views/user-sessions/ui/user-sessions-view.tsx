import { Container } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { notFound, redirect } from "next/navigation";

import { SESSION_ROLE } from "@/entities/game";
import { DepartedMemberScreen } from "@/entities/profile";
import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import {
  countableCards,
  loadProfile,
  PROFILE_SESSION_SECTIONS,
  SessionEmptyLine,
  SessionList,
  SessionTabs,
  userSessionsHref,
} from "@/widgets/session-list";

export async function UserSessionsView({ id, tab }: { id: string; tab?: string }) {
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
    count: countableCards(sessions[section.key]).length,
    href: serverPath({
      slug: server.slug,
      path: userSessionsHref({ userId: profile.id, role: section.key }),
    }),
  }));

  return (
    <>
      <AppBar back={`/users/${profile.id}`} title={`${profile.username}의 세션`} />
      <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) bg-surface">
        <SessionTabs label="세션 기록" tabs={tabs} activeKey={activeSection.key} />
      </div>
      <Container size="sm">
        <div className="py-250">
          {items.length > 0 ? (
            <SessionList items={items} />
          ) : (
            <SessionEmptyLine text={activeSection.empty} />
          )}
        </div>
      </Container>
    </>
  );
}
