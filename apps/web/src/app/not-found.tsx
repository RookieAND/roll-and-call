import { Button } from "@roll-and-call/ui";
import type { Metadata } from "next";
import Link from "next/link";

import { ErrorScreen } from "@/shared/ui";

import { AppFrame } from "./app-frame";

export const metadata: Metadata = { title: "페이지를 찾을 수 없습니다" };

// 없는 서버 slug도 여기로 와서 useParams에 server가 남는다. 탭 바를 끄지 않으면 없는 서버의 탭이 보인다.
export default function NotFound() {
  return (
    <AppFrame bottomNav={false}>
      <ErrorScreen
        image="empty-search"
        title="페이지를 찾을 수 없습니다"
        description={
          <>
            주소가 바뀌었거나 없는 서버입니다.
            <br />
            내 서버 목록에서 다시 찾아 주세요.
          </>
        }
        action={
          <>
            <Button variant="outline" render={<Link href="/" />}>
              내 서버 보기
            </Button>
            <Button render={<Link href="/help" />}>도움말</Button>
          </>
        }
        homeLink={false}
      />
    </AppFrame>
  );
}
