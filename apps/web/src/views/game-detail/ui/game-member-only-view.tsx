import { Button, Container } from "@roll-and-call/ui";
import Link from "next/link";

import { LoginButton } from "@/features/auth";
import { serverJoinPath, serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, EmptyState } from "@/shared/ui";

interface GameMemberOnlyViewProps {
  id: string;
}

// 구인 상세는 멤버만 본다. 비멤버에게는 가입 안내만 보이고, 공유 미리보기(OG)는 page의 메타데이터가 맡는다.
export async function GameMemberOnlyView({ id }: GameMemberOnlyViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const gamePath = serverPath({ slug: server.slug, path: `/games/${id}` });
  return (
    <>
      <AppBar back="/games" backHistory={false} title="구인 상세" heading={false} />
      <Container size="sm">
        <div className="py-300">
          <EmptyState
            title="멤버만 볼 수 있는 구인글이에요"
            description={`${server.name} 디스코드 서버 멤버라면 가입하고 바로 볼 수 있어요.`}
            action={
              user ? (
                <Button
                  render={<Link href={serverJoinPath({ slug: server.slug, next: gamePath })} />}
                  size="lg"
                  className="mt-100 w-full"
                >
                  가입하기
                </Button>
              ) : (
                <LoginButton next={gamePath} className="mt-100 w-full" />
              )
            }
          />
        </div>
      </Container>
    </>
  );
}
