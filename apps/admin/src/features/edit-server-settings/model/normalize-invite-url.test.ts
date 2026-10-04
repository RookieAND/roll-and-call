import { describe, expect, it } from "vitest";

import { INVITE_URL_ERROR, normalizeInviteUrl } from "./normalize-invite-url";

describe("normalizeInviteUrl", () => {
  it("디스코드 https 초대 링크는 그대로, 주소만 넣으면 https를 붙인다", () => {
    expect(normalizeInviteUrl("https://discord.gg/abc")).toEqual({
      ok: true,
      url: "https://discord.gg/abc",
    });
    expect(normalizeInviteUrl(" discord.gg/abc ")).toEqual({
      ok: true,
      url: "https://discord.gg/abc",
    });
    expect(normalizeInviteUrl("https://discord.com/invite/abc")).toMatchObject({ ok: true });
  });

  it("비우면 null로 저장한다", () => {
    expect(normalizeInviteUrl("  ")).toEqual({ ok: true, url: null });
  });

  it("http 주소, 다른 도메인, 형식이 틀린 값은 오류 결과", () => {
    const failed = { ok: false, error: INVITE_URL_ERROR };
    expect(normalizeInviteUrl("http://discord.gg/abc")).toEqual(failed);
    expect(normalizeInviteUrl("https://example.com/abc")).toEqual(failed);
    expect(normalizeInviteUrl("trpia-invite")).toEqual(failed);
    expect(normalizeInviteUrl("https://discord.gg/")).toEqual(failed);
  });
});
