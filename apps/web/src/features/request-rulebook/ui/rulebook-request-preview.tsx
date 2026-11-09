"use client";

import { RULEBOOK_REQUEST_MAX_BOOKS } from "@roll-and-call/database/rulebooks/model";
import { Button, Sheet, Text } from "@roll-and-call/ui";
import { useState } from "react";

import { RulebookRequestBody } from "./rulebook-request-body";
import { SheetTitleRow } from "./sheet-title-row";

// 개발 전용 시안은 실제 DB에 요청을 저장하지 않는다.
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
            최대 {RULEBOOK_REQUEST_MAX_BOOKS}권까지 함께 요청할 수 있어요.
            <br />
            운영진은 책마다 따로 검토하고, 결과를 알림으로 알려 드립니다.
          </Text>
        </div>
      }
      renderLayout={
        sheet
          ? undefined
          : ({ editor, list }) => (
              <div className="grid items-start gap-200 desktop:grid-cols-[minmax(0,640px)_320px]">
                <div className="rounded-600 border border-gray-200 bg-surface p-250">{editor}</div>
                <aside className="desktop:sticky desktop:top-200">{list}</aside>
              </div>
            )
      }
    />
  );
  return (
    <main id="main" className="min-h-dvh bg-canvas">
      <div className="border-b border-gray-200 bg-surface">
        <div className="mx-auto flex max-w-245 items-center justify-between gap-100 px-200 py-150">
          <Text typography="subtitle1">룰북 추가 요청</Text>
          <Button size="sm" variant="outline" onClick={() => setSheet(true)}>
            시트로 보기
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-245 px-200 py-250">
        <Text typography="body4" foreground="muted" render={<p />} className="mb-175">
          개발 시안 · 실제 데이터는 저장되지 않습니다.
        </Text>
        {submitted && (
          <Text
            role="status"
            typography="body3"
            foreground="success"
            render={<p />}
            className="mb-175"
          >
            일괄 요청 시안 제출을 완료했습니다.
          </Text>
        )}
        {!sheet && body}
      </div>
      <Sheet.Root open={sheet} onOpenChange={setSheet}>
        <Sheet.Overlay />
        <Sheet.Popup aria-label="룰북 추가 요청 시안" className="h-[92dvh] px-0">
          <Sheet.Handle />
          <SheetTitleRow title="룰북 추가 요청" />
          <Sheet.Body className="px-200 pb-200">{sheet && body}</Sheet.Body>
        </Sheet.Popup>
      </Sheet.Root>
    </main>
  );
}
