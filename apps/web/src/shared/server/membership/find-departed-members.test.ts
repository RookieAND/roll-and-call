import { DiscordApiError } from "@roll-and-call/discord";
import { delay } from "es-toolkit";
import { describe, expect, it } from "vitest";

import { findDepartedMembers, MEMBER_CHECK_CONCURRENCY } from "./find-departed-members";

const rateLimited = () => new DiscordApiError("429", 429, null, 0.001);

describe("findDepartedMembers", () => {
  it("멤버가 아닌 사람만 골라낸다", async () => {
    const result = await findDepartedMembers({
      members: ["a", "b", "c"],
      isMember: async (member) => member !== "b",
    });
    expect(result).toEqual({ skipped: false, checked: 3, departed: ["b"] });
  });

  it("동시에 5명까지만 확인한다", async () => {
    let running = 0;
    let peak = 0;
    await findDepartedMembers({
      members: Array.from({ length: 20 }, (_, index) => index),
      isMember: async () => {
        running += 1;
        peak = Math.max(peak, running);
        await delay(2);
        running -= 1;
        return true;
      },
    });
    expect(peak).toBe(MEMBER_CHECK_CONCURRENCY);
  });

  it("429면 한 번 다시 부른다", async () => {
    let calls = 0;
    const result = await findDepartedMembers({
      members: ["a"],
      isMember: async () => {
        calls += 1;
        if (calls === 1) throw rateLimited();
        return false;
      },
    });
    expect(calls).toBe(2);
    expect(result.departed).toEqual(["a"]);
  });

  it("두 번째도 429면 그 서버를 건너뛴다", async () => {
    const result = await findDepartedMembers({
      members: ["a", "b"],
      isMember: async (member) => {
        if (member === "a") throw rateLimited();
        return false;
      },
    });
    expect(result).toEqual({ skipped: true, checked: 0, departed: [] });
  });

  it("403·5xx는 다시 부르지 않고 그 서버를 건너뛴다", async () => {
    let calls = 0;
    const result = await findDepartedMembers({
      members: ["a", "b"],
      isMember: async (member) => {
        calls += 1;
        if (member === "a") throw new DiscordApiError("403", 403, 50001);
        return false;
      },
    });
    expect(calls).toBe(2);
    expect(result.skipped).toBe(true);
  });
});
