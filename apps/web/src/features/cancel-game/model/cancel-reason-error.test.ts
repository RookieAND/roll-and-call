import { describe, expect, it } from "vitest";

import { cancelReasonError } from "./cancel-reason-error";

describe("cancelReasonError", () => {
  it("공백뿐인 사유는 거부한다", () => {
    expect(cancelReasonError("   ")).toBe("취소 사유를 입력해 주세요.");
  });

  it("앞뒤 공백을 빼고 200자까지 받는다", () => {
    expect(cancelReasonError(` ${"가".repeat(200)} `)).toBeNull();
    expect(cancelReasonError("가".repeat(201))).toBe("취소 사유는 200자까지 쓸 수 있습니다.");
  });
});
