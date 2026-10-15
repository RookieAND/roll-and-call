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
