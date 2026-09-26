import { describe, expect, it } from "vitest";

import { applyHint } from "./apply-hint";
import type { BookDraft } from "./book-draft";
import { PHOTO_SLOT } from "./photo-slot";
import { EMPTY_PURCHASE } from "./purchase-record";

const done = { status: PHOTO_SLOT.done, url: "u" } as const;
const empty = { status: PHOTO_SLOT.empty } as const;

const draft = (overrides: Partial<BookDraft>): BookDraft => ({
  format: "physical",
  shots: { front: done, back: done, side: done },
  proofs: { order: empty, receipt: empty },
  purchase: EMPTY_PURCHASE,
  seller: "",
  sellerOther: "",
  ...overrides,
});

describe("applyHint", () => {
  it("비운 사진 칸을 알려 준다", () => {
    expect(applyHint([draft({ shots: { front: done, back: empty, side: empty } })])).toEqual({
      ready: false,
      hint: "뒷면·책등 사진을 올려 주세요",
    });
  });

  it("전자책은 판매처와 주문번호까지 채워야 한다", () => {
    const ebook = draft({ format: "ebook", proofs: { order: done, receipt: done } });
    expect(applyHint([ebook]).hint).toBe("판매처를 골라 주세요");
    expect(
      applyHint([
        ebook,
        { ...ebook, seller: "리디", purchase: { ...EMPTY_PURCHASE, orderNumber: "1" } },
      ]),
    ).toEqual({ ready: false, hint: "2권 모두 채우면 신청할 수 있습니다" });
  });

  it("여러 권을 다 채우면 형식별 권수를 적는다", () => {
    const ebook = draft({
      format: "ebook",
      proofs: { order: done, receipt: done },
      seller: "리디",
      purchase: { ...EMPTY_PURCHASE, orderNumber: "1" },
    });
    expect(applyHint([draft({}), ebook])).toEqual({ ready: true, hint: "실물 1권 · 전자책 1권" });
  });
});
