import { describe, expect, it } from "vitest";

import {
  duplicateRequestErrors,
  newRequestDraft,
  rulebookRequestsSchema,
} from "./rulebook-request-form";

describe("일괄 룰북 요청 입력", () => {
  it("대소문자·양끝 공백을 무시하고 같은 판본의 중복을 모두 표시한다", () => {
    const items = [" Book ", "book", "다른 책"].map((name, index) => ({
      ...newRequestDraft(String(index)),
      name,
      clientId: String(index),
      edition: "7판",
    }));
    expect(duplicateRequestErrors(items).map((error) => error.clientId)).toEqual(["0", "1"]);
    expect(duplicateRequestErrors([items[2]!], ["다른 책 7판"])).toHaveLength(1);
    expect(duplicateRequestErrors([{ ...items[0]!, edition: "6판" }, items[1]!])).toEqual([]);
  });

  it("한 권도 허용하고, 빈 목록·빈 이름·상한 초과·잘못된 링크를 거부한다", () => {
    const item = newRequestDraft("a", "책");
    expect(rulebookRequestsSchema.safeParse({ items: [item] }).success).toBe(true);
    expect(rulebookRequestsSchema.safeParse({ items: [] }).success).toBe(false);
    expect(rulebookRequestsSchema.safeParse({ items: [{ ...item, name: " " }] }).success).toBe(
      false,
    );
    expect(
      rulebookRequestsSchema.safeParse({ items: [{ ...item, link: "판매 페이지" }] }).success,
    ).toBe(false);
    expect(
      rulebookRequestsSchema.safeParse({
        items: Array.from({ length: 21 }, (_, index) => ({ ...item, clientId: String(index) })),
      }).success,
    ).toBe(false);
  });
});
