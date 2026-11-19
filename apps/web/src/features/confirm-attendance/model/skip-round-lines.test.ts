import { describe, expect, it } from "vitest";

import { skipRoundLines } from "./skip-round-lines";

describe("회차 생략 확인 문구", () => {
  it("지정형은 회차 수 줄과 후기 줄을 붙인다", () => {
    expect(skipRoundLines({ designated: true, roundCount: 6, reviewCount: 2 })).toEqual([
      "이 회차는 없던 회차가 됩니다.",
      "출석, 순위, 후기에서 모두 빠지고 뒤 회차 번호가 하나씩 당겨집니다.",
      "예정 회차 수가 6회에서 5회로 줄어듭니다.",
      "이 회차에 작성된 후기 2건도 함께 지워집니다.",
      "이 작업은 되돌릴 수 없습니다.",
    ]);
  });

  it("조율형이고 후기가 없으면 두 줄이 없다", () => {
    expect(skipRoundLines({ designated: false, roundCount: 6, reviewCount: 0 })).toHaveLength(3);
  });
});
