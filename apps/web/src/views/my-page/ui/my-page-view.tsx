import { Container, HStack, VStack } from "@trpg/ui";
import { redirect } from "next/navigation";
import { profileDisplay } from "@/entities/profile";
import { getCurrentUser, getGamesByGm, getJoinedGames, getProfile } from "@/shared/server";
import { AppBar, StatCard } from "@/shared/ui";
import { summarizeMySessions } from "../model/my-page-summary";
import { MyPageHeader } from "./my-page-header";
import { PastSessionsLink } from "./past-sessions-link";
import { HostedSessionsEmpty, UpcomingSessionsEmpty } from "./session-summary-empty";
import { SessionSummarySection } from "./session-summary-section";

export async function MyPageView() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const [profile, hosted, joined] = await Promise.all([
    getProfile(user.id),
    getGamesByGm(user.id),
    getJoinedGames(user.id),
  ]);

  const { name, avatar, handle } = profileDisplay({ profile, user });
  const { upcoming, hosting, hostedBefore, pastCount, pastHref } = summarizeMySessions({
    hosted,
    joined,
    viewerId: user.id,
  });

  return (
    <>
      <AppBar title="마이페이지" />
      <Container size="sm">
        <VStack gap={6} className="py-6">
          <MyPageHeader name={name} avatarUrl={avatar} handle={handle} />

          <HStack className="gap-[9px]">
            <div className="flex-1">
              <StatCard value={upcoming.length} label="참여 예정" />
            </div>
            <div className="flex-1">
              <StatCard value={hosting.length} label="운영 중" />
            </div>
          </HStack>

          <SessionSummarySection
            title="참여 예정인 세션"
            items={upcoming}
            moreHref="/me/sessions/joined"
            empty={<UpcomingSessionsEmpty />}
          />

          <SessionSummarySection
            title="운영 중인 세션"
            items={hosting}
            moreHref="/me/sessions/hosted"
            empty={<HostedSessionsEmpty hostedBefore={hostedBefore} />}
          />

          <PastSessionsLink count={pastCount} href={pastHref} />
        </VStack>
      </Container>
    </>
  );
}
