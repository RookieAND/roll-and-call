import { describe, expect, it } from "vitest";

import { NO_SHOW_STATUS } from "@/entities/no-show";

import { recentCountFacts } from "./recent-count-facts";

describe("recentCountFacts", () => {
  it("유효 기록은 이 기록을 빼면 하나 줄어든다", () => {
    expect(recentCountFacts({ status: NO_SHOW_STATUS.valid, recentNoShowCount: 2 })).toEqual({
      without: 1,
      with: 2,
    });
  });

  it("취소된 기록은 되돌리면 하나 늘어난다", () => {
    expect(recentCountFacts({ status: NO_SHOW_STATUS.cancelled, recentNoShowCount: 1 })).toEqual({
      without: 1,
      with: 2,
    });
  });

  it("기간 지난 기록은 보이지 않는다", () => {
    expect(recentCountFacts({ status: NO_SHOW_STATUS.expired, recentNoShowCount: 3 })).toBeNull();
  });
});
