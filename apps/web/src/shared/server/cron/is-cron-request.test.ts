import { afterEach, describe, expect, it, vi } from "vitest";

import { isCronRequest } from "./is-cron-request";

const requestWith = (authorization?: string) =>
  new Request("https://example.com/api/cron/test", {
    method: "POST",
    headers: authorization ? { authorization } : {},
  });

describe("isCronRequest", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("CRON_SECRET이 없으면 false", () => {
    vi.stubEnv("CRON_SECRET", "");
    expect(isCronRequest(requestWith("Bearer "))).toBe(false);
  });

  it("헤더가 없으면 false", () => {
    vi.stubEnv("CRON_SECRET", "secret");
    expect(isCronRequest(requestWith())).toBe(false);
  });

  it("다른 값이면 false", () => {
    vi.stubEnv("CRON_SECRET", "secret");
    expect(isCronRequest(requestWith("Bearer secreT"))).toBe(false);
  });

  it("길이가 다른 값이면 false", () => {
    vi.stubEnv("CRON_SECRET", "secret");
    expect(isCronRequest(requestWith("Bearer secret2"))).toBe(false);
  });

  it("맞는 값이면 true", () => {
    vi.stubEnv("CRON_SECRET", "secret");
    expect(isCronRequest(requestWith("Bearer secret"))).toBe(true);
  });
});
