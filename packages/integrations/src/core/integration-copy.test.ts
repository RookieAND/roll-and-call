import { readFileSync } from "node:fs";

import { expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
// 포맷터가 줄 길이에 따라 import를 접고 펴므로 공백과 끝 쉼표는 무시한다.
const squash = (source: string) => source.replace(/\s+/g, "").replace(/,}/g, "}");
const edgeCopy = "../../../../supabase/functions/session-reminders/integration/";
const CORE_FILES = [
  "integration-envelope",
  "integration-headers",
  "integration-response",
  "sign-integration-body",
  "send-integration-event",
];

it.each(CORE_FILES)("Edge Function의 %s.ts는 core의 복사본과 같다", (name) => {
  const copy = read(`${edgeCopy}${name}.ts`).replaceAll('.ts";', '";');
  expect(squash(copy)).toBe(squash(read(`./${name}.ts`)));
});
