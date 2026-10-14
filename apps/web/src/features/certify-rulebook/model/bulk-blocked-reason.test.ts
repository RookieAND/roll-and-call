import { describe, expect, it } from "vitest";

import { bulkBlockedReason } from "./bulk-blocked-reason";

const book = (
  id: string,
  partial: Partial<Parameters<typeof bulkBlockedReason>[0]["books"][number]> = {},
) => ({
  id,
  name: id,
  edition: "",
  kind: "core",
  categoryId: "c",
  certRequired: true,
  supersedesId: null,
  ...partial,
});

const base = { certifiedIds: new Set<string>(), pendingIds: new Set<string>() };

describe("bulkBlockedReason", () => {
  it("모두 신청할 수 있으면 null이다", () => {
    expect(
      bulkBlockedReason({ ...base, rulebookIds: ["a", "b"], books: [book("a"), book("b")] }),
    ).toBeNull();
  });

  it("이미 인증됐거나 심사 중인 책은 책 이름과 함께 알린다", () => {
    const books = [book("a"), book("b")];
    expect(
      bulkBlockedReason({ ...base, rulebookIds: ["a", "b"], books, certifiedIds: new Set(["a"]) }),
    ).toBe("a: 이미 인증된 룰북입니다.");
    expect(
      bulkBlockedReason({ ...base, rulebookIds: ["a", "b"], books, pendingIds: new Set(["b"]) }),
    ).toBe("b: 심사 중인 신청이 있습니다.");
  });

  it("인증이 필요 없는 책은 받지 않는다", () => {
    expect(
      bulkBlockedReason({
        ...base,
        rulebookIds: ["a"],
        books: [book("a", { certRequired: false })],
      }),
    ).toBe("a: 인증 없이 구인을 열 수 있는 룰입니다.");
  });

  it("서플리먼트는 기본 룰북이 묶음에 함께 있어야 받는다", () => {
    const books = [book("core"), book("sup", { kind: "supplement" })];
    expect(bulkBlockedReason({ ...base, rulebookIds: ["sup"], books })).toBe(
      "sup: 같은 판본의 기본 룰북을 선택해야 합니다.",
    );
    expect(bulkBlockedReason({ ...base, rulebookIds: ["core", "sup"], books })).toBeNull();
  });

  it("목록에 없는 책이 있으면 다시 고르라고 한다", () => {
    expect(bulkBlockedReason({ ...base, rulebookIds: ["x"], books: [book("a")] })).toBe(
      "책을 다시 골라야 합니다.",
    );
  });
});
