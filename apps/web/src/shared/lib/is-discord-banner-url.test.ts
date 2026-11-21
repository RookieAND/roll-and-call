import { describe, expect, it } from "vitest";

import { isDiscordBannerUrl } from "./is-discord-banner-url";

describe("isDiscordBannerUrl", () => {
  it("디스코드 배너 CDN 주소만 받는다", () => {
    expect(isDiscordBannerUrl("https://cdn.discordapp.com/banners/123/abc123.png?size=600")).toBe(
      true,
    );
    expect(isDiscordBannerUrl("https://cdn.discordapp.com/banners/123/a_abc123.gif?size=600")).toBe(
      true,
    );
    expect(isDiscordBannerUrl("https://cdn.discordapp.com/avatars/123/abc123.png")).toBe(false);
    expect(isDiscordBannerUrl("https://evil.example.com/banners/123/abc.png")).toBe(false);
  });
});
