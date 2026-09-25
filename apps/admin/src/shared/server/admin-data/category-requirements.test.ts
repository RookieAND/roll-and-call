import { describe, expect, it } from "vitest";

import { categoryRequirements } from "./category-requirements";

const book = (id: string, name: string, edition: string, extra = {}) => ({
  id,
  name,
  edition,
  kind: "core" as const,
  supersedesId: null,
  certRequired: true,
  ...extra,
});

describe("categoryRequirements", () => {
  it("구판 구인은 신판으로도 열 수 있고, 서플리먼트는 기본 룰북 인증이 먼저다", () => {
    expect(
      categoryRequirements([
        book("6", "수호자 룰북", "6판"),
        book("7", "수호자 룰북", "7판", { supersedesId: "6" }),
        book("p", "펄프 크툴루", "7판", { kind: "supplement" }),
      ]),
    ).toEqual([
      { label: "6판 구인", requirement: "수호자 룰북 6판 또는 수호자 룰북 7판", hosting: true },
      { label: "7판 구인", requirement: "수호자 룰북 7판", hosting: true },
      { label: "7판 서플리먼트", requirement: "7판 기본 룰북 인증 필요", hosting: false },
    ]);
  });

  it("같은 판본의 기본 룰북이 여러 권이면 모두 필요하다", () => {
    const [requirement] = categoryRequirements([
      book("1", "더블크로스 1권", "3rd"),
      book("2", "더블크로스 2권", "3rd"),
    ]);
    expect(requirement!.requirement).toBe("더블크로스 1권 3rd, 더블크로스 2권 3rd 모두");
  });

  it("인증이 필요 없는 룰북은 그렇다고 적는다", () => {
    const [requirement] = categoryRequirements([book("f", "너냐?!", "F", { certRequired: false })]);
    expect(requirement!.requirement).toBe("너냐?! F (인증 불필요)");
  });
});
