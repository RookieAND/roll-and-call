import { describe, expect, it } from "vitest";

import { actionTone } from "./action-tone";

describe("actionTone", () => {
  it("불참 취소 파랑, 승인·직접 인증·해제 초록, 반려·제재·취소 빨강, 나머지 회색", () => {
    expect(actionTone("불참 취소")).toBe("primary");
    expect(actionTone("인증 승인")).toBe("success");
    expect(actionTone("직접 인증")).toBe("success");
    expect(actionTone("제재 해제")).toBe("success");
    expect(actionTone("반려로 돌림")).toBe("danger");
    expect(actionTone("제재")).toBe("danger");
    expect(actionTone("구인 취소")).toBe("danger");
    expect(actionTone("운영진 메모")).toBe("gray");
  });
});
