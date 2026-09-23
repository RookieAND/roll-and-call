import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { AppBar, ErrorScreen } from "@/shared/ui";

export default function NotFound() {
  return (
    <>
      <AppBar back="/games" title="구인 상세" />
      <ErrorScreen
        image="/empty-states/empty-search.png"
        title="찾을 수 없는 구인입니다"
        description={
          <>
            GM이 구인을 취소했거나 주소가 바뀌었습니다.
            <br />
            다른 모집 중인 구인을 둘러보세요.
          </>
        }
        action={
          <Button render={<Link href="/games" />} variant="outline">
            구인 목록 보기
          </Button>
        }
        homeLink={false}
      />
    </>
  );
}
