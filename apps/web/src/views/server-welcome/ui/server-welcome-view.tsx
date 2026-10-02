import { Container, Text, VStack } from "@roll-and-call/ui";

import { getCurrentServer, getCurrentSessionUser, getProfile } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { ServerIntroForm } from "./server-intro-form";

interface ServerWelcomeViewProps {
  next: string;
}

// (member) 레이아웃을 지나 왔으니 로그인한 멤버다.
export async function ServerWelcomeView({ next }: ServerWelcomeViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const profile = user ? await getProfile(server.id, user.id) : undefined;

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
              이 서버에서 보일 프로필을 적어 두면 함께할 사람을 찾기 쉬워요. 지금 건너뛰어도
              마이페이지에서 언제든 고칠 수 있어요.
            </Text>
          </VStack>
          <ServerIntroForm
            defaultBio={profile?.bio ?? ""}
            defaultKeywords={profile?.keywords ?? []}
            next={next}
          />
        </VStack>
      </Container>
    </>
  );
}
