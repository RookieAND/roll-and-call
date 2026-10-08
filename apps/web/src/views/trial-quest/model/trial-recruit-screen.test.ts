import { describe, expect, it } from "vitest";

import { TRIAL_MINE_GAME_ID } from "./trial-kind";
import { recruitScreenOfPath, TRIAL_RECRUIT_SCREEN } from "./trial-recruit-screen";

describe("첫 모집 화면 주소", () => {
  it("목록, 내 구인 상세, 운영 관리만 열린다", () => {
    expect(recruitScreenOfPath("/games")).toBe(TRIAL_RECRUIT_SCREEN.list);
    expect(recruitScreenOfPath(`/games/${TRIAL_MINE_GAME_ID}`)).toBe(TRIAL_RECRUIT_SCREEN.mine);
    expect(recruitScreenOfPath(`/games/${TRIAL_MINE_GAME_ID}/manage`)).toBe(
      TRIAL_RECRUIT_SCREEN.manage,
    );
  });

  it("다른 구인이나 화면은 열리지 않는다", () => {
    expect(recruitScreenOfPath("/games/trial-game-lottery")).toBeNull();
    expect(recruitScreenOfPath("/me/rulebooks")).toBeNull();
  });
});
