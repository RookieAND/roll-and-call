import { describe, expect, it } from "vitest";

import { bulkDraftMissing } from "./bulk-draft-missing";
import { emptyBulkDraft } from "./empty-bulk-draft";
import { PHOTO_SLOT } from "./photo-slot";

const done = { status: PHOTO_SLOT.done, key: "u", previewUrl: "" } as const;

describe("bulkDraftMissing", () => {
  it("사진이 한 장도 없으면 올려 달라고 한다", () => {
    expect(bulkDraftMissing(emptyBulkDraft())).toBe("사진을 한 장 이상 올려야 합니다");
  });

  it("한 장만 올려도 통과한다", () => {
    expect(bulkDraftMissing({ photos: [done] })).toBeNull();
  });

  it("올리는 중이면 기다리라고 한다", () => {
    const uploading = { status: PHOTO_SLOT.uploading, progress: 0.4 } as const;
    expect(bulkDraftMissing({ photos: [done, uploading] })).toBe("사진을 올리는 중입니다");
  });

  it("실패한 사진은 몇 번째인지 알려 준다", () => {
    const error = { status: PHOTO_SLOT.error, message: "x" } as const;
    expect(bulkDraftMissing({ photos: [done, error] })).toBe("사진 2번을 다시 올려야 합니다");
  });
});
