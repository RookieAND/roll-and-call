import { readFileSync } from "node:fs";

import { expect, it } from "vitest";

import { defaultMessageText } from "./message-texts";

it("edge function의 remind 기본 문장이 message-texts와 같다", () => {
  const source = readFileSync(
    new URL("../../../../../../supabase/functions/session-reminders/index.ts", import.meta.url),
    "utf8",
  );
  const copied = /DEFAULT_DESCRIPTION = "([^"]+)"/.exec(source)?.[1];

  expect(copied).toBe(defaultMessageText("remind"));
});
