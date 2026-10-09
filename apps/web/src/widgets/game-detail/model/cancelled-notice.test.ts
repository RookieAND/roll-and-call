import { describe, expect, it } from "vitest";

import { GAME_CANCEL_KIND } from "@/entities/game";

import { cancelledNotice } from "./cancelled-notice";

describe("cancelledNotice", () => {
  it("선발 기한 취소는 제목 하나에 설명 한 줄이다", () => {
    expect(
      cancelledNotice({
        cancelKind: GAME_CANCEL_KIND.selectionExpired,
        selection: true,
        reason: null,
      }),
    ).toEqual({
      title: "구인이 취소되었습니다",
      line: "기한 안에 선발을 마치지 않아 취소되었습니다.",
    });
  });

  it("선발 구인의 인원 미달 취소는 선발된 인원 기준으로 알린다", () => {
    expect(
      cancelledNotice({
        cancelKind: GAME_CANCEL_KIND.minPlayersUnmet,
        selection: true,
        reason: null,
      }),
    ).toEqual({
      title: "구인이 취소되었습니다",
      line: "선발된 인원이 최소 인원에 미치지 못해 취소되었습니다.",
    });
  });

  it("다른 방식의 인원 미달 취소와 GM 취소는 기존 문구를 쓴다", () => {
    expect(
      cancelledNotice({
        cancelKind: GAME_CANCEL_KIND.minPlayersUnmet,
        selection: false,
        reason: null,
      }),
    ).toEqual({
      title: "최소 인원이 모이지 않아 취소되었습니다",
      line: "비슷한 조건의 다른 구인글을 찾아보세요.",
    });
    expect(
      cancelledNotice({ cancelKind: GAME_CANCEL_KIND.gm, selection: false, reason: "일정 변경" })
        .line,
    ).toBe("사유: 일정 변경");
  });
});
