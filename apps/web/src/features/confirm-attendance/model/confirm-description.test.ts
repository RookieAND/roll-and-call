import { describe, expect, it } from "vitest";

import { confirmDescription } from "./confirm-description";

describe("confirmDescription", () => {
  it("불참 이름으로 첫 줄과 남는 기록 줄을 만든다", () => {
    expect(confirmDescription(["이한울", "윤소라"])).toEqual({
      headline: "이한울, 윤소라님이 불참으로 기록됩니다.",
      lines: [
        "불참 기록이 이한울, 윤소라님의 프로필에 세션 날짜부터 30일 동안 남습니다.",
        "이 세션은 이한울, 윤소라님의 참여한 세션 수와 이 달의 기록에 들어가지 않습니다.",
      ],
    });
  });
});
