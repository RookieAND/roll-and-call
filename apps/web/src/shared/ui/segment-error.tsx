"use client";

import { Button } from "@roll-and-call/ui";

import { AppBar } from "./app-bar";
import { ErrorScreen } from "./error-screen";
import { PageShell } from "./page-shell";

interface SegmentErrorProps {
  // 앱바 제목. 오류가 나도 화면 이름과 뒤로 가기가 남는다.
  appBarTitle: string;
  back?: string;
  // "~을(를) 불러오지 못했습니다"에 들어갈 대상.
  subject: string;
  retry: () => void;
}

export function SegmentError({ appBarTitle, back, subject, retry }: SegmentErrorProps) {
  return (
    <PageShell appBar={<AppBar back={back} title={appBarTitle} />}>
      <ErrorScreen
        title={`${subject} 불러오지 못했습니다`}
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
    </PageShell>
  );
}
