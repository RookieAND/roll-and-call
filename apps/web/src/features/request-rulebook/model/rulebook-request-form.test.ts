import { describe, expect, it } from "vitest";

import {
  duplicateRequestErrors,
  EMPTY_REQUEST_DEFAULTS,
  requestNamesFromText,
  resolveRequestDraft,
  rulebookRequestsSchema,
  type RequestDraft,
} from "./rulebook-request-form";

describe("일괄 룰북 요청 입력", () => {
  it("공통값 변경은 직접 수정하지 않은 필드에만 반영한다", () => {
    const draft: RequestDraft = {
      clientId: "a",
      name: "서플리먼트",
      overrides: { edition: "6판", link: "" },
    };
    const value = resolveRequestDraft(draft, {
      category: "크툴루의 부름",
      edition: "7판",
      kind: "supplement",
      link: "https://example.com",
    });
    expect(value).toMatchObject({
      edition: "6판",
      link: "",
      kind: "supplement",
      category: "크툴루의 부름",
    });
  });

  it("줄바꿈과 빈 줄을 정리하되 책 이름의 쉼표는 유지한다", () => {
    expect(requestNamesFromText("  첫 번째 책\r\n\r\n 두 번째, 특별판 \n")).toEqual([
      "첫 번째 책",
      "두 번째, 특별판",
    ]);
  });

  it("대소문자·양끝 공백을 무시하고 같은 판본의 중복을 모두 표시한다", () => {
    const items = [" Book ", "book", "다른 책"].map((name, index) => ({
      ...EMPTY_REQUEST_DEFAULTS,
      name,
      clientId: String(index),
      edition: "7판",
    }));
    expect(duplicateRequestErrors(items).map((error) => error.clientId)).toEqual(["0", "1"]);
    expect(duplicateRequestErrors([items[2]!], ["다른 책 7판"])).toHaveLength(1);
    expect(duplicateRequestErrors([{ ...items[0]!, edition: "6판" }, items[1]!])).toEqual([]);
  });

  it("한 권도 허용하고, 빈 목록·빈 이름·상한 초과·잘못된 링크를 거부한다", () => {
    const item = { ...EMPTY_REQUEST_DEFAULTS, name: "책", clientId: "a" };
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
