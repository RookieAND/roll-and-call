"use client";

import { Button, Container } from "@roll-and-call/ui";

import { AppBar, EmptyState } from "@/shared/ui";

// views/games 배럴은 서버 모듈을 끌고 와 클라이언트 경계에서 쓸 수 없어 앱바를 여기서 그린다.
export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return (
    <>
      <AppBar title="구인 목록" brand />
      <Container className="py-300">
        <EmptyState
          image="/empty-states/empty-error.png"
          title="구인 목록을 불러오지 못했습니다"
          description={"연결이 잠시 끊겼을 수 있습니다.\n잠시 뒤 다시 시도해주세요."}
          action={
            <Button variant="outline" onClick={retry} className="mt-100">
              다시 불러오기
            </Button>
          }
        />
      </Container>
    </>
  );
}
