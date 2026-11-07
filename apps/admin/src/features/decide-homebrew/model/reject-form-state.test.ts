import { describe, expect, it } from "vitest";

import { rejectFormState } from "./reject-form-state";

describe("rejectFormState", () => {
  it("사유를 고르기 전에는 반려할 수 없다", () => {
    expect(rejectFormState({ reason: null, message: "" }).canSubmit).toBe(false);
  });

  it("고른 사유는 문구를 비워도 반려할 수 있다", () => {
    expect(rejectFormState({ reason: "자료를 열 수 없음", message: "" }).canSubmit).toBe(true);
  });

  it("기타는 공백만으로는 반려할 수 없다", () => {
    const state = rejectFormState({ reason: "기타", message: "  " });
    expect(state.otherBlank).toBe(true);
    expect(state.canSubmit).toBe(false);
    expect(rejectFormState({ reason: "기타", message: "사유" }).canSubmit).toBe(true);
  });

  it("글자 수는 코드 포인트로 세고 200자에 닿으면 가득 찬다", () => {
    expect(rejectFormState({ reason: "기타", message: "😀가" }).length).toBe(2);
    expect(rejectFormState({ reason: "기타", message: "가".repeat(199) }).full).toBe(false);
    expect(rejectFormState({ reason: "기타", message: "가".repeat(200) }).full).toBe(true);
  });
});
