import { describe, expect, it } from "vitest";

import type { BookDraft } from "./book-draft";
import { draftMissing } from "./draft-missing";
import { PHOTO_SLOT } from "./photo-slot";

const done = { status: PHOTO_SLOT.done, key: "u", previewUrl: "" } as const;
const empty = { status: PHOTO_SLOT.empty } as const;

const draft = (overrides: Partial<BookDraft>): BookDraft => ({
  format: "physical",
  shots: { front: done, back: done, side: done },
  proofs: { order: empty, receipt: empty },
  seller: "",
  sellerOther: "",
  orderNumber: "",
  orderDate: "",
  ...overrides,
});

describe("draftMissing", () => {
  it("비운 사진 칸을 알려 준다", () => {
    expect(draftMissing(draft({ shots: { front: done, back: empty, side: empty } }))).toBe(
      "뒷면·책등 사진을 올려 주세요",
    );
    expect(draftMissing(draft({}))).toBeNull();
  });

  it("전자책은 판매처 → 주문일 → 주문번호 순서로 묻는다", () => {
    const ebook = draft({ format: "ebook", proofs: { order: done, receipt: done } });
    expect(draftMissing(ebook)).toBe("판매처를 골라 주세요");
    expect(draftMissing({ ...ebook, seller: "리디" })).toBe("주문일을 적어 주세요");
    const dated = { ...ebook, seller: "리디", orderDate: "2026.09.12" };
    expect(draftMissing(dated)).toBe("주문번호를 적어 주세요");
    expect(draftMissing({ ...dated, orderNumber: "  " })).toBe("주문번호를 적어 주세요");
    expect(draftMissing({ ...dated, orderNumber: "A-1" })).toBeNull();
  });
});
