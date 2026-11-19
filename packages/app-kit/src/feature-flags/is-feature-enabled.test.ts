import { afterEach, describe, expect, it, vi } from "vitest";

import { isFeatureEnabled } from "./is-feature-enabled";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isFeatureEnabled", () => {
  it("기본값은 꺼짐", () => {
    expect(isFeatureEnabled("multiRound")).toBe(false);
    expect(isFeatureEnabled("multiRoundCoordinated")).toBe(false);
  });

  it("환경 변수를 켜고 끄면 값이 바뀐다", () => {
    vi.stubEnv("FEATURE_MULTI_ROUND", "true");
    expect(isFeatureEnabled("multiRound")).toBe(true);
    vi.stubEnv("FEATURE_MULTI_ROUND", "false");
    expect(isFeatureEnabled("multiRound")).toBe(false);
  });

  it("조율형은 지정형이 꺼져 있으면 켜지지 않는다", () => {
    vi.stubEnv("FEATURE_MULTI_ROUND_COORDINATED", "1");
    expect(isFeatureEnabled("multiRoundCoordinated")).toBe(false);
    vi.stubEnv("FEATURE_MULTI_ROUND", "1");
    expect(isFeatureEnabled("multiRoundCoordinated")).toBe(true);
  });
});
