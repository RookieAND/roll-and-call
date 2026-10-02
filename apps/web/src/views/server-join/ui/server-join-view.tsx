import { Container, Text, VStack } from "@roll-and-call/ui";
import { redirect } from "next/navigation";

import { LoginButton } from "@/features/auth";
import { JoinServerPanel } from "@/features/join-server";
import { serverJoinPath } from "@/shared/lib";
import { getCurrentMembership, getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, ServerIcon } from "@/shared/ui";

interface ServerJoinViewProps {
  next: string;
}

export async function ServerJoinView({ next }: ServerJoinViewProps) {
  const [server, user, membership] = await Promise.all([
    getCurrentServer(),
    getCurrentSessionUser(),
    getCurrentMembership(),
  ]);
  if (membership) redirect(next);

  return (
    <>
      <AppBar title="서버 가입" heading={false} />
      <Container size="sm">
        <VStack gap="300" className="py-400">
          <VStack gap="150" align="center" className="text-center">
            <ServerIcon name={server.name} icon={server.icon} size="lg" />
            <Text typography="heading1" render={<h1 />}>
              {server.name}
            </Text>
            <Text typography="body2" foreground="muted" render={<p />} className="text-pretty">
              이 서버의 디스코드 멤버만 가입할 수 있어요.
            </Text>
          </VStack>
          {user ? (
            <JoinServerPanel next={next} inviteUrl={server.inviteUrl} />
          ) : (
            <LoginButton next={serverJoinPath({ slug: server.slug, next })} className="w-full" />
          )}
        </VStack>
      </Container>
    </>
  );
}
