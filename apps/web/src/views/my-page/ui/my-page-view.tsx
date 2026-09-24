import { Container, VStack } from "@roll-and-call/ui";

import { profileDisplay } from "@/entities/profile";
import { CERT_STATE, toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { getCurrentSessionUser, getProfile, getRulebookRecords } from "@/shared/server";
import { AppBar, HelpButton } from "@/shared/ui";
import { loadMySessions } from "@/widgets/session-list";

import { summarizeMySessions } from "../model/my-page-summary";
import { sessionTodos } from "../model/session-todos";
import { MyPageLinks } from "./my-page-links";
import { MyPageProfile } from "./my-page-profile";
import { MyPageRulebooks } from "./my-page-rulebooks";
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
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const [profile, mySessions, rulebookRecords] = await Promise.all([
    getProfile(user.id),
    loadMySessions(user.id),
    getRulebookRecords(user.id),
  ]);
  const rulebooks = toMyRulebooks(rulebookRecords);
  const rejectedRulebooks = rulebooks.rulebooks.filter(
    (rulebook) => rulebook.state === CERT_STATE.rejected,
  );

  const { name, avatar, handle } = profileDisplay({ profile, user });
  const sessions = summarizeMySessions(mySessions);
  const todos = sessionTodos(mySessions);
  const handleLabel = handle ? `@${handle}` : null;

  return (
    <>
      <AppBar title="마이페이지" action={<HelpButton />} />
      <Container size="sm">
        <VStack gap="250" className="py-225">
          <MyPageProfile
            name={name}
            avatarUrl={avatar}
            bio={profile?.bio ?? null}
            keywords={profile?.keywords ?? []}
            availability={profile?.availability ?? []}
          />
          <MyPageTodos todos={todos} rejectedRulebooks={rejectedRulebooks} />
          <MyPageRulebooks rulebooks={rulebooks} />
          <MyPageSessions sessions={sessions} />
          <MyPageLinks links={profile?.links ?? []} />
          <MyPageSettings handleLabel={handleLabel} />
        </VStack>
      </Container>
    </>
  );
}
