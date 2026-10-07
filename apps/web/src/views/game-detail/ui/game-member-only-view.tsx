import { Button, Container, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import type { ReactNode } from "react";

import { LoginButton } from "@/features/auth";
import { serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, ErrorScreen } from "@/shared/ui";

interface GameMemberOnlyViewProps {
  id: string;
}

// 구인 상세는 멤버만 본다. 비멤버에게는 서버 가입 안내만 보이고, 공유 미리보기(OG)는 page의 메타데이터가 맡는다.
export async function GameMemberOnlyView({ id }: GameMemberOnlyViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const gamePath = serverPath({ slug: server.slug, path: `/games/${id}` });

  let action: ReactNode;
  if (!user) {
    action = <LoginButton next={gamePath} className="w-full" />;
  } else if (isNull(server.inviteUrl)) {
    action = (
      <Text typography="body4" foreground="hint">
        서버 운영진에게 초대를 요청해 주세요.
      </Text>
    );
  } else {
    action = (
      <Button
        colorPalette="discord"
        size="lg"
        className="w-full"
        render={<a href={server.inviteUrl} target="_blank" rel="noopener noreferrer" />}
      >
        디스코드 서버 들어가기
      </Button>
    );
  }

  return (
    <>
      <AppBar back="/" backHistory={false} title="구인 상세" heading={false} />
      <Container size="sm">
        <ErrorScreen
          image="empty-search"
          title={`${server.name} 멤버만 볼 수 있는 구인입니다`}
          description="디스코드 서버에 들어온 뒤 로그인하면 내용을 보고 신청할 수 있습니다."
          action={action}
          homeLink={false}
        />
      </Container>
    </>
  );
}
