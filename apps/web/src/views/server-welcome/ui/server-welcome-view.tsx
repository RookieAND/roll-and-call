import { listMemberServers } from "@roll-and-call/database/servers";
import { Container, Text, VStack } from "@roll-and-call/ui";

import { getCurrentServer, getCurrentSessionUser, getProfile } from "@/shared/server";
import { AppBar, ServerLink } from "@/shared/ui";

import { ProfileImportCallout } from "./profile-import-callout";
import { WelcomeUsernameForm } from "./welcome-username-form";

interface ServerWelcomeViewProps {
  next: string;
}

// (member) 레이아웃을 지나 왔으니 로그인한 멤버다.
export async function ServerWelcomeView({ next }: ServerWelcomeViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const [profile, memberServers] = user
    ? await Promise.all([getProfile(server.id, user.id), listMemberServers(user.id)])
    : [undefined, []];
  const otherServers = memberServers.filter((memberServer) => memberServer.id !== server.id);

  return (
    <>
      <AppBar title="가입 완료" heading={false} />
      <Container size="md">
        <VStack gap="300" className="py-300">
          <VStack gap="100">
            <Text typography="heading1" render={<h1 />} className="text-pretty">
              {server.name}에 오신 걸 환영해요
            </Text>
            <Text typography="body2" foreground="muted" render={<p />} className="text-pretty">
              닉네임만 확인하면 바로 시작할 수 있어요. 소개·성향·링크·기본 가능 시간은 나중에{" "}
              <ServerLink path="/me/edit" className="underline">
                마이페이지
              </ServerLink>
              에서 채워도 돼요.
            </Text>
          </VStack>
          {otherServers.length > 0 && <ProfileImportCallout servers={otherServers} />}
          <WelcomeUsernameForm defaultUsername={profile?.username ?? ""} next={next} />
        </VStack>
      </Container>
    </>
  );
}
