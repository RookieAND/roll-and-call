import { describe, expect, it } from "vitest";

import { confirmDescription } from "./confirm-description";

describe("confirmDescription", () => {
  it("불참 이름으로 남는 기록 줄과 알림 줄을 만든다", () => {
    expect(confirmDescription(["이한울", "윤소라"])).toEqual({
      names: "이한울, 윤소라",
      warningLines: [
        "이한울, 윤소라님 프로필에 30일 동안 보입니다.",
        "이 달의 기록에는 들어가지 않습니다.",
      ],
      notice: "이한울, 윤소라님에게 알림이 갑니다.",
    });
  });
});
