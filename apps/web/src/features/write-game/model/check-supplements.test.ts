import { describe, expect, it } from "vitest";

import { CERT_STATE, editionSets, ruleSetOf, type MyRulebook } from "@/entities/rulebook";

import { checkSupplements } from "./check-supplements";

const book = (id: string, overrides: Partial<MyRulebook> = {}) =>
  ({
    id,
    name: id,
    label: id,
    shortName: id,
    aliases: [],
    categoryId: "shinobi",
    categoryName: "시노비가미",
    edition: "",
    kind: "supplement",
    certRequired: true,
    state: null,
    stateAt: null,
    latestApplication: null,
    unlockedBy: null,
    ...overrides,
  }) as MyRulebook;

const [set] = editionSets([
  book("시노비가미", { kind: "core", state: CERT_STATE.certified }),
  book("인비전", { state: CERT_STATE.certified }),
  book("정인기", { aliases: ["정인 기"] }),
]);

describe("checkSupplements", () => {
  it("인증한 책과 직접 입력한 책을 순서대로 받고 등록된 이름은 목록 이름으로 바꾼다", () => {
    const result = checkSupplements({
      supplements: [
        { name: "옛 이름", rulebookId: "인비전" },
        { name: " 새 책 ", rulebookId: null },
      ],
      set: set!,
      enforced: true,
    });
    expect(result).toEqual({
      ok: true,
      supplements: [
        { name: "인비전", rulebookId: "인비전" },
        { name: "새 책", rulebookId: null },
      ],
    });
  });

  it("인증하지 않은 책은 새로 넣지 못하지만 이미 저장된 책은 남긴다", () => {
    const supplements = [{ name: "정인기", rulebookId: "정인기" }];
    expect(checkSupplements({ supplements, set: set!, enforced: true }).ok).toBe(false);
    expect(
      checkSupplements({ supplements, set: set!, previous: supplements, enforced: true }).ok,
    ).toBe(true);
  });

  it("등록된 책 이름이나 다른 이름을 직접 입력하면 막는다", () => {
    const result = checkSupplements({
      supplements: [{ name: "정인기", rulebookId: null }],
      set: set!,
      enforced: true,
    });
    expect(result).toEqual({
      ok: false,
      error: "목록에 있는 서플리먼트입니다. 목록에서 골라야 합니다.",
    });
    expect(
      checkSupplements({
        supplements: [{ name: "정 인기", rulebookId: null }],
        set: set!,
        enforced: true,
      }).ok,
    ).toBe(false);
  });

  it("이미 저장한 직접 입력 이름은 같은 책이 등록된 뒤에도 남긴다", () => {
    const supplements = [{ name: "정인기", rulebookId: null }];
    expect(
      checkSupplements({ supplements, set: set!, previous: supplements, enforced: true }).ok,
    ).toBe(true);
  });

  it("같은 이름을 두 번 직접 입력하면 막는다", () => {
    const result = checkSupplements({
      supplements: [
        { name: "새 책", rulebookId: null },
        { name: "새책", rulebookId: null },
      ],
      set: set!,
      enforced: true,
    });
    expect(result).toEqual({ ok: false, error: "이미 넣은 서플리먼트입니다." });
  });

  it("유예 기간에는 인증하지 않은 책도 새로 넣을 수 있다", () => {
    const supplements = [{ name: "정인기", rulebookId: "정인기" }];
    expect(checkSupplements({ supplements, set: set!, enforced: false }).ok).toBe(true);
  });
});

describe("checkSupplements — 구판 서플리먼트 상속", () => {
  const oldCore = (overrides: Partial<MyRulebook> = {}) =>
    book("구판 코어", { kind: "core", edition: "구판", ...overrides });
  const newCore = book("신판 코어", {
    kind: "core",
    edition: "신판",
    state: CERT_STATE.certified,
  });
  const oldSupplement = (overrides: Partial<MyRulebook> = {}) =>
    book("구판 서플", { edition: "구판", ...overrides });
  const setFor = (rulebooks: MyRulebook[], rulebookId: string) =>
    ruleSetOf({ myRulebooks: { rulebooks, sets: editionSets(rulebooks) }, rulebookId });

  it("신판 세트에서 구판 서플리먼트를 새로 넣을 수 있다", () => {
    const rulebooks = [
      newCore,
      oldCore({ unlockedBy: newCore }),
      oldSupplement({ unlockedBy: newCore }),
    ];
    const result = checkSupplements({
      supplements: [{ name: "구판 서플", rulebookId: "구판 서플" }],
      set: setFor(rulebooks, "신판 코어"),
      enforced: true,
    });
    expect(result.ok).toBe(true);
  });

  it("인증하지 않은 구판 서플리먼트는 구판 보유자만 막힌다", () => {
    const oldCertified = oldCore({ state: CERT_STATE.certified });
    const supplements = [{ name: "구판 서플", rulebookId: "구판 서플" }];
    const holderOfOld = [oldCertified, oldSupplement()];
    expect(
      checkSupplements({ supplements, set: setFor(holderOfOld, "구판 코어"), enforced: true }).ok,
    ).toBe(false);
    const holderOfNew = [
      newCore,
      oldCore({ unlockedBy: newCore }),
      oldSupplement({ unlockedBy: newCore }),
    ];
    expect(
      checkSupplements({ supplements, set: setFor(holderOfNew, "신판 코어"), enforced: true }).ok,
    ).toBe(true);
  });

  it("상속된 구판 서플리먼트 이름을 직접 입력하면 막는다", () => {
    const rulebooks = [
      newCore,
      oldCore({ unlockedBy: newCore }),
      oldSupplement({ unlockedBy: newCore }),
    ];
    expect(
      checkSupplements({
        supplements: [{ name: "구판 서플", rulebookId: null }],
        set: setFor(rulebooks, "신판 코어"),
        enforced: true,
      }),
    ).toEqual({ ok: false, error: "목록에 있는 서플리먼트입니다. 목록에서 골라야 합니다." });
  });
});
