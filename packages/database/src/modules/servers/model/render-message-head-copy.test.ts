import { readFileSync } from "node:fs";

import { expect, it } from "vitest";

it("1시간 전 알림 Edge Function의 render-message-head.ts는 이 모듈의 복사본과 같다", () => {
  const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
  expect(
    read("../../../../../../supabase/functions/session-reminders/render-message-head.ts"),
  ).toBe(read("./render-message-head.ts"));
});
