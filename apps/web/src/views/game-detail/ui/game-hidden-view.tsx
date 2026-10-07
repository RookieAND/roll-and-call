import { Button } from "@roll-and-call/ui";

import { AppBar, ErrorScreen, ServerLink } from "@/shared/ui";

// 운영진이 숨긴 구인을 GM도 참여자도 아닌 사람이 열었을 때(R7). 없는 구인 화면과 같은 틀이다.
export function GameHiddenView() {
  return (
    <>
      <AppBar back="/games" backHistory={false} title="구인 상세" />
      <ErrorScreen
        image="empty-search"
        title="운영진이 숨긴 구인입니다"
        description="지금은 내용을 볼 수 없습니다."
        action={
          <Button render={<ServerLink path="/games" />} variant="outline">
            구인 목록 보기
          </Button>
        }
        homeLink={false}
      />
    </>
  );
}
