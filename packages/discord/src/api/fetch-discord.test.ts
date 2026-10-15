import { afterEach, describe, expect, it, vi } from "vitest";

import { DiscordApiError } from "./discord-api-error";
import { fetchDiscord } from "./fetch-discord";

const responseOf = (status: number) => new Response(status === 200 ? "{}" : "oops", { status });

describe("fetchDiscord", () => {
  vi.stubEnv("DISCORD_BOT_TOKEN", "token");
  afterEach(() => vi.unstubAllGlobals());

  it("다시 보내도 되는 요청은 5xx면 한 번 더 부른다", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(responseOf(502))
      .mockResolvedValueOnce(responseOf(200));
    vi.stubGlobal("fetch", fetchMock);
    await fetchDiscord({ path: "/x", method: "GET", headers: {}, timeoutMs: 1000 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("POST와 4xx는 다시 부르지 않고 DiscordApiError로 올린다", async () => {
    const fetchMock = vi.fn().mockResolvedValue(responseOf(502));
    vi.stubGlobal("fetch", fetchMock);
    await expect(
      fetchDiscord({ path: "/x", method: "POST", headers: {}, timeoutMs: 1000 }),
    ).rejects.toBeInstanceOf(DiscordApiError);
    fetchMock.mockResolvedValue(responseOf(404));
    await expect(
      fetchDiscord({ path: "/x", method: "GET", headers: {}, timeoutMs: 1000 }),
    ).rejects.toBeInstanceOf(DiscordApiError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
