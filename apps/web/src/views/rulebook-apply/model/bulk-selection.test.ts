import { BULK_CERT_MAX_BOOKS } from "@roll-and-call/database/certifications/model";
import { describe, expect, it } from "vitest";

import { CERT_STATE, type MyRulebook } from "@/entities/rulebook";

import { isBulkSelectable, pruneBulkSelection, toggleBulkSelection } from "./bulk-selection";

const book = (id: string, overrides: Partial<MyRulebook> = {}) =>
  ({
    id,
    shortName: id,
    categoryId: "coc",
    categoryName: "크툴루의 부름",
    edition: "7판",
    kind: "core",
    certRequired: true,
    state: null,
    stateAt: null,
    latestApplication: null,
    unlockedBy: null,
    ...overrides,
  }) as MyRulebook;

const keeper = book("keeper");
const investigator = book("investigator");
const companion = book("companion", { kind: "supplement" });
const rulebooks = [keeper, investigator, companion];

describe("isBulkSelectable", () => {
  it("인증이 필요한 기본 룰북은 고를 수 있다", () => {
    expect(isBulkSelectable({ rulebook: keeper, rulebooks, selectedIds: [] })).toBe(true);
  });

  it("이미 인증된 책은 고를 수 없다", () => {
    const certified = book("done", { state: CERT_STATE.certified });
    expect(isBulkSelectable({ rulebook: certified, rulebooks: [certified], selectedIds: [] })).toBe(
      false,
    );
  });

  it("서플리먼트는 기본 룰북을 모두 함께 골라야 고를 수 있다", () => {
    expect(isBulkSelectable({ rulebook: companion, rulebooks, selectedIds: ["keeper"] })).toBe(
      false,
    );
    expect(
      isBulkSelectable({
        rulebook: companion,
        rulebooks,
        selectedIds: ["keeper", "investigator"],
      }),
    ).toBe(true);
  });

  it("기본 룰북이 이미 인증됐으면 서플리먼트만 골라도 된다", () => {
    const opened = [
      book("keeper", { state: CERT_STATE.certified }),
      book("investigator", { state: CERT_STATE.certified }),
      companion,
    ];
    expect(isBulkSelectable({ rulebook: companion, rulebooks: opened, selectedIds: [] })).toBe(
      true,
    );
  });
});

describe("pruneBulkSelection", () => {
  it("기본 룰북이 빠지면 조건을 잃은 서플리먼트도 뺀다", () => {
    expect(pruneBulkSelection({ rulebooks, selectedIds: ["keeper", "companion"] })).toEqual([
      "keeper",
    ]);
  });

  it("목록에 없는 id는 버린다", () => {
    expect(pruneBulkSelection({ rulebooks, selectedIds: ["keeper", "ghost"] })).toEqual(["keeper"]);
  });
});

describe("toggleBulkSelection", () => {
  it("고르지 않은 책을 누르면 더하고, 고른 책을 누르면 뺀다", () => {
    const added = toggleBulkSelection({ rulebooks, selectedIds: [], rulebookId: "keeper" });
    expect(added).toEqual(["keeper"]);
    expect(toggleBulkSelection({ rulebooks, selectedIds: added, rulebookId: "keeper" })).toEqual(
      [],
    );
  });

  it("기본 룰북을 빼면 함께 고른 서플리먼트도 빠진다", () => {
    expect(
      toggleBulkSelection({
        rulebooks,
        selectedIds: ["keeper", "investigator", "companion"],
        rulebookId: "keeper",
      }),
    ).toEqual(["investigator"]);
  });

  it("한도를 넘기는 선택은 받지 않는다", () => {
    const many = Array.from({ length: BULK_CERT_MAX_BOOKS }, (_, index) => `book-${index}`);
    expect(toggleBulkSelection({ rulebooks, selectedIds: many, rulebookId: "keeper" })).toEqual(
      many,
    );
  });
});
