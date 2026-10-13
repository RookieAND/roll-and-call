import { describe, expect, it } from "vitest";

import { settingsAudit } from "./settings-audit";

describe("settingsAudit", () => {
  it("바뀐 칸마다 전후 값을 남긴다", () => {
    const audit = settingsAudit({
      serverName: "TRPIA",
      fields: [
        { label: "공지 채널", display: "#운영-공지", previous: "#공지" },
        { label: "운영진 채널", display: null, previous: "#운영진" },
      ],
      invite: { changed: true, before: null, after: "https://discord.gg/abc" },
    });
    expect(audit?.target).toBe("TRPIA · 공지 채널, 운영진 채널, 초대 링크");
    expect(audit?.changes).toEqual([
      { field: "공지 채널", before: "#공지", after: "#운영-공지" },
      { field: "운영진 채널", before: "#운영진", after: undefined },
      { field: "초대 링크", before: undefined, after: "https://discord.gg/abc" },
    ]);
  });

  it("바뀐 게 없으면 null이다", () => {
    expect(
      settingsAudit({
        serverName: "TRPIA",
        fields: [],
        invite: { changed: false, before: null, after: null },
      }),
    ).toBeNull();
  });
});
