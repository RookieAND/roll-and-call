import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { ErrorScreen } from "@/shared/ui";

import { AppFrame } from "./app-frame";

// 없는 서버(/nope/…)도 여기로 온다. 그 주소의 [server] 값이 남아 있어 서버 홈 링크(ServerLink)는 같은 404로 돌아가므로,
// 서버 밖 주소(인덱스의 내 서버 목록, 도움말)로만 보낸다.
export default function NotFound() {
  return (
    <AppFrame>
      <ErrorScreen
        image="/empty-states/empty-search.png"
        title="페이지를 찾을 수 없어요"
        description={
          <>
            주소가 바뀌었거나 없는 서버예요.
            <br />내 서버 목록에서 다시 찾아보세요.
          </>
        }
        action={
          <>
            <Button render={<Link href="/" />}>내 서버 보기</Button>
            <Button variant="outline" render={<Link href="/help" />}>
              도움말
            </Button>
          </>
        }
        homeLink={false}
      />
    </AppFrame>
  );
}
