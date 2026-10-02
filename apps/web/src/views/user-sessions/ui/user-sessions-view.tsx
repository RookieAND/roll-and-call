import { Container } from "@roll-and-call/ui";
import { notFound, redirect } from "next/navigation";

import { SESSION_ROLE } from "@/entities/game";
import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import {
  loadProfile,
  PROFILE_SESSION_SECTIONS,
  SessionEmptyLine,
  SessionList,
  SessionTabs,
  userSessionsHref,
} from "@/widgets/session-list";

export async function UserSessionsView({ id, tab }: { id: string; tab?: string }) {
  const server = await getCurrentServer();
  const [viewer, loaded] = await Promise.all([getCurrentSessionUser(), loadProfile(id)]);
  if (viewer?.id === id) redirect(serverPath({ slug: server.slug, path: "/me/sessions" }));
  if (!loaded) notFound();

  const { profile, sessions } = loaded;
  const activeSection =
    PROFILE_SESSION_SECTIONS.find((section) => section.key === tab) ??
    PROFILE_SESSION_SECTIONS.find((section) => section.key === SESSION_ROLE.host)!;
  const items = sessions[activeSection.key];
  const tabs = PROFILE_SESSION_SECTIONS.map((section) => ({
    key: section.key,
    label: section.title,
    count: sessions[section.key].length,
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
