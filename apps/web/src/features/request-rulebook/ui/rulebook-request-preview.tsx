"use client";

import { Button, Container, FloatingBar, Sheet, Text } from "@roll-and-call/ui";
import { useState } from "react";

import { RulebookRequestBody } from "./rulebook-request-body";

// 개발 환경 전용 시안. 실제 요청 저장이나 운영진 알림을 실행하지 않는다.
export function RulebookRequestPreview() {
  const [sheet, setSheet] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const body = (
    <RulebookRequestBody
      categoryNames={["크툴루의 부름", "던전 앤 드래곤", "패스파인더"]}
      pendingRequestNames={["이미 요청된 책 7판"]}
      initialName=""
      onSent={() => {
        setSubmitted(true);
        setSheet(false);
      }}
      submitRequests={async ({ items }) => ({ createdCount: items.length })}
      intro={
        <div className="space-y-075">
          <Text typography="heading2" render={<h1 />}>
            찾는 룰북을 알려 주세요
          </Text>
          <Text typography="body2" foreground="muted" render={<p />}>
            기본 룰북부터 서플리먼트까지, 여러 권을 한 번에 요청하세요.
            <br />
            검토 결과는 책마다 알림으로 알려 드립니다.
          </Text>
        </div>
      }
      renderFooter={({ submit, pending, disabled, count }) =>
        sheet ? (
          <Button
            size="lg"
            className="mt-200 w-full"
            disabled={disabled}
            loading={pending}
            onClick={submit}
          >
            {count}권 추가 요청 보내기
          </Button>
        ) : (
          <FloatingBar.Root elevated={false}>
            <FloatingBar.Content>
              <Container size="sm">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={disabled}
                  loading={pending}
                  onClick={submit}
                >
                  {count}권 추가 요청 보내기
                </Button>
              </Container>
            </FloatingBar.Content>
            <FloatingBar.Spacer />
          </FloatingBar.Root>
        )
      }
    />
  );
  return (
    <main id="main" className="min-h-dvh bg-canvas">
      <div className="border-b border-gray-200 bg-surface">
        <Container size="sm">
          <div className="flex items-center justify-between gap-100 py-150">
            <Text typography="subtitle1">룰북 추가 요청</Text>
            <Button size="sm" variant="outline" onClick={() => setSheet(true)}>
              시트로 보기
            </Button>
          </div>
        </Container>
      </div>
      <Container size="sm">
        <div className="pt-200">
          <Text typography="body4" foreground="muted">
            개발 시안 · 실제 데이터는 저장되지 않습니다.
          </Text>
          {submitted && (
            <Text
              role="status"
              typography="body3"
              foreground="success"
              render={<p />}
              className="mt-100"
            >
              일괄 요청 시안 제출을 완료했습니다.
            </Text>
          )}
        </div>
        <div className="py-250">{!sheet && body}</div>
      </Container>
      <Sheet.Root open={sheet} onOpenChange={setSheet}>
        <Sheet.Overlay />
        <Sheet.Popup aria-label="룰북 추가 요청 시안" className="h-[92dvh] px-0">
          <Sheet.Handle />
          <Sheet.Body className="px-200 pb-200">{sheet && body}</Sheet.Body>
        </Sheet.Popup>
      </Sheet.Root>
    </main>
  );
}
