import { Container, VStack } from "@trpg/ui";

import { profileDisplay } from "@/entities/profile";
import { LoginRequired } from "@/features/auth";
import { getCurrentSessionUser, getProfile } from "@/shared/server";
import { AppBar, HelpButton } from "@/shared/ui";
import { loadMySessions } from "@/widgets/session-list";

import { summarizeMySessions } from "../model/my-page-summary";
import { sessionTodos } from "../model/session-todos";
import { MyPageLinks } from "./my-page-links";
import { MyPageProfile } from "./my-page-profile";
import { MyPageSessions } from "./my-page-sessions";
import { MyPageSettings } from "./my-page-settings";
import { MyPageTodos } from "./my-page-todos";

export async function MyPageView() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar title="마이페이지" action={<HelpButton />} />
        <Container size="sm">
          <div className="py-6">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const [profile, mySessions] = await Promise.all([getProfile(user.id), loadMySessions(user.id)]);

  const { name, avatar, handle } = profileDisplay({ profile, user });
  const sessions = summarizeMySessions(mySessions);
  const todos = sessionTodos(mySessions);
  const handleLabel = handle ? `@${handle}` : null;

  return (
    <>
      <AppBar title="마이페이지" action={<HelpButton />} />
      <Container size="sm">
        <VStack gap={5} className="py-4.5">
          <MyPageProfile
            name={name}
            avatarUrl={avatar}
            bio={profile?.bio ?? null}
            keywords={profile?.keywords ?? []}
            availability={profile?.availability ?? []}
          />
          {todos.length > 0 && <MyPageTodos todos={todos} />}
          <MyPageSessions sessions={sessions} />
          <MyPageLinks links={profile?.links ?? []} />
          <MyPageSettings handleLabel={handleLabel} />
        </VStack>
      </Container>
    </>
  );
}
