"use client";

import { Button } from "@roll-and-call/ui";

import { AppBar, ErrorScreen } from "@/shared/ui";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return (
    <>
      <AppBar back="/games" title="출석 확인" />
      <ErrorScreen
        title="출석 명단을 불러오지 못했습니다"
        description={
          <>
            연결이 잠시 끊겼을 수 있습니다.
            <br />
            잠시 뒤 다시 시도해주세요.
          </>
        }
        action={
          <Button variant="outline" onClick={retry}>
            다시 불러오기
          </Button>
        }
        homeLink={false}
      />
    </>
  );
}
