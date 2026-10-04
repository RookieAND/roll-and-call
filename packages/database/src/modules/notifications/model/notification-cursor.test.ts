import { describe, expect, it } from "vitest";

import { decodeNotificationCursor } from "./decode-notification-cursor";
import { encodeNotificationCursor } from "./encode-notification-cursor";

const at = "2026-10-05T03:04:05.123456Z";
const id = "6f1c2a3b-4d5e-4f60-8a7b-9c0d1e2f3a4b";

describe("notification cursor", () => {
  it("인코딩·디코딩이 왕복한다", () => {
    expect(decodeNotificationCursor(encodeNotificationCursor({ at, id }))).toEqual({ at, id });
  });

  it.each([
    null,
    undefined,
    "",
    "garbage",
    `${at}~not-a-uuid`,
    `2026-10-05~${id}`,
    `${at}~${id}~extra`,
    `2026-10-05T03:04:05.123Z~${id}`,
  ])("잘못된 값 %s은 null", (value) => {
    expect(decodeNotificationCursor(value)).toBeNull();
  });
});
