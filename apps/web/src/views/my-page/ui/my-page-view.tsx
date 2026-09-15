import { Container, VStack } from "@trpg/ui";

import { profileDisplay } from "@/entities/profile";
import { LoginRequired } from "@/features/auth";
import { getCurrentUser, getProfile } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { loadMySessions } from "@/widgets/session-list";

import { summarizeMySessions } from "../model/my-page-summary";
import { MyPageHeader } from "./my-page-header";
import { MyPageSessions } from "./my-page-sessions";
import { MyPageSettings } from "./my-page-settings";

export async function MyPageView() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        <AppBar title="마이페이지" />
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
  const handleLabel = handle ? `@${handle}` : null;

  return (
    <>
      <AppBar title="마이페이지" />
      <Container size="sm">
        <VStack gap={5} className="py-[18px]">
          <MyPageHeader name={name} avatarUrl={avatar} bio={profile?.bio ?? null} />
          <MyPageSessions sessions={sessions} />
          <MyPageSettings handleLabel={handleLabel} />
        </VStack>
      </Container>
    </>
  );
}
