import { readFileSync } from "node:fs";

import { expect, it } from "vitest";

import { DEFAULT_MESSAGE_HEADS } from "./message-heads";
import { defaultMessageText } from "./message-texts";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const edgeFunction = "../../../../../../supabase/functions/session-reminders/";

it("1시간 전 알림 Edge Function의 render-message-head.ts는 이 모듈의 복사본과 같다", () => {
  expect(read(`${edgeFunction}render-message-head.ts`)).toBe(read("./render-message-head.ts"));
});

it("1시간 전 알림 Edge Function의 기본 머리 줄·문장은 이 모듈의 remind 기본값과 같다", () => {
  const source = read(`${edgeFunction}index.ts`);
  expect(source).toContain(`const DEFAULT_HEAD = ${JSON.stringify(DEFAULT_MESSAGE_HEADS.remind)};`);
  expect(source).toContain(
    `const DEFAULT_DESCRIPTION = ${JSON.stringify(defaultMessageText("remind"))};`,
  );
});

it("세션 시작 안내 Edge Function의 기본 머리 줄·문장은 이 모듈의 start 기본값과 같다", () => {
  const source = read(`${edgeFunction}start-notice.ts`).replace(/=\s+/g, "= ");
  expect(source).toContain(`const DEFAULT_HEAD = ${JSON.stringify(DEFAULT_MESSAGE_HEADS.start)};`);
  expect(source).toContain(
    `const DEFAULT_DESCRIPTION = ${JSON.stringify(defaultMessageText("start"))};`,
  );
});

it("세션 시작 안내 Edge Function의 버튼 접두사는 game-notices와 같다", () => {
  const source = read(`${edgeFunction}start-notice.ts`);
  const notices = "../../../../../game-notices/src/notify/";
  expect(read(`${notices}attendance-button.ts`)).toContain(
    `ATTENDANCE_BUTTON_PREFIX = "attendance:"`,
  );
  expect(read(`${notices}review-button.ts`)).toContain(`REVIEW_BUTTON_PREFIX = "review:"`);
  expect(source).toContain(`const ATTENDANCE_BUTTON_PREFIX = "attendance:";`);
  expect(source).toContain(`const REVIEW_BUTTON_PREFIX = "review:";`);
});
