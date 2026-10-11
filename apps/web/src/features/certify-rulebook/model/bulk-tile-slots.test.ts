import { describe, expect, it } from "vitest";

import { bulkTileSlots } from "./bulk-tile-slots";
import { emptyBulkDraft } from "./empty-bulk-draft";
import { PHOTO_SLOT } from "./photo-slot";
import { removeBulkPhoto } from "./remove-bulk-photo";
import { setBulkPhoto } from "./set-bulk-photo";

const done = (key: string) => ({ status: PHOTO_SLOT.done, key, previewUrl: "" }) as const;

describe("bulkTileSlots", () => {
  it("처음에는 빈 칸 하나만 보인다", () => {
    expect(bulkTileSlots(emptyBulkDraft())).toHaveLength(1);
  });

  it("마지막 칸까지 채우면 다음 빈 칸을 하나 더 보인다", () => {
    const tiles = bulkTileSlots({ photos: [done("a")] });
    expect(tiles.map((tile) => tile.status)).toEqual([PHOTO_SLOT.done, PHOTO_SLOT.empty]);
  });

  it("다섯 장을 채우면 더 보이지 않는다", () => {
    const photos = ["a", "b", "c", "d", "e"].map(done);
    expect(bulkTileSlots({ photos })).toHaveLength(5);
  });

  it("올리는 중인 칸 뒤에는 새 칸을 보이지 않는다", () => {
    const uploading = { status: PHOTO_SLOT.uploading, progress: 0.2 } as const;
    expect(bulkTileSlots({ photos: [uploading] })).toHaveLength(1);
  });
});

describe("setBulkPhoto·removeBulkPhoto", () => {
  it("끝 다음 번호에 놓으면 칸이 늘어난다", () => {
    const draft = setBulkPhoto({ draft: { photos: [done("a")] }, index: 1, slot: done("b") });
    expect(draft.photos).toHaveLength(2);
  });

  it("가운데 사진을 지우면 뒤 사진이 당겨진다", () => {
    const draft = removeBulkPhoto({
      draft: { photos: [done("a"), done("b"), done("c")] },
      index: 1,
    });
    expect(draft.photos).toEqual([done("a"), done("c")]);
  });

  it("마지막 한 장을 지우면 빈 칸 하나가 남는다", () => {
    const draft = removeBulkPhoto({ draft: { photos: [done("a")] }, index: 0 });
    expect(draft.photos).toEqual([{ status: PHOTO_SLOT.empty }]);
  });
});
