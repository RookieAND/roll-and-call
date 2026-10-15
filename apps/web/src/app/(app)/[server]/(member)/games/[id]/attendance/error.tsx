"use client";

import { Button } from "@roll-and-call/ui";

import { AppBar, DESKTOP_CARD_CLASS, ErrorScreen, PageShell } from "@/shared/ui";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return (
    <PageShell readable appBar={<AppBar back="/games" title="출석 확인" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <ErrorScreen
          title="출석 명단을 불러오지 못했습니다"
          description={
            <>
              연결이 잠시 끊겼을 수 있습니다.
              <br />
              잠시 뒤 다시 시도해 주세요.
            </>
          }
          action={
            <Button variant="outline" onClick={retry}>
              다시 불러오기
            </Button>
          }
          homeLink={false}
        />
      </div>
    </PageShell>
  );
}
