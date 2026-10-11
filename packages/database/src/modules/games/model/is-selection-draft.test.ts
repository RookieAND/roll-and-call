import { describe, expect, it } from "vitest";

import { isSelectionDraft } from "./is-selection-draft";
import { RECRUIT_METHOD } from "./recruit-method";

describe("isSelectionDraft", () => {
  it("선발을 마치기 전이면 초안이다", () => {
    expect(
      isSelectionDraft({ recruitMethod: RECRUIT_METHOD.selection, selectionFinishedAt: null }),
    ).toBe(true);
  });

  it("선발을 마친 뒤에는 초안이 아니다", () => {
    expect(
      isSelectionDraft({ recruitMethod: RECRUIT_METHOD.selection, selectionFinishedAt: new Date() }),
    ).toBe(false);
  });

  it("선착순·추첨은 초안이 아니다", () => {
    expect(
      isSelectionDraft({ recruitMethod: RECRUIT_METHOD.firstCome, selectionFinishedAt: null }),
    ).toBe(false);
    expect(
      isSelectionDraft({ recruitMethod: RECRUIT_METHOD.lottery, selectionFinishedAt: null }),
    ).toBe(false);
  });
});
