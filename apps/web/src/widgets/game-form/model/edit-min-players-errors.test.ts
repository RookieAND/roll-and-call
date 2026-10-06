import { describe, expect, it, vi } from "vitest";

import type { GameFormValues } from "@/features/write-game";

import { editMinPlayersErrors } from "./edit-min-players-errors";
import type { GameEditContext } from "./game-form-layout";

// features/write-game 인덱스가 서버 액션을 함께 내보내서 server-only를 비운다.
vi.mock("server-only", () => ({}));

const edit: GameEditContext = {
  gameId: "g",
  applicantCount: 0,
  confirmedCount: 0,
  drawn: false,
  minPlayers: 4,
};

function errors({
  values,
  context = {},
}: {
  values: { minPlayers: string; maxPlayers: string };
  context?: Partial<GameEditContext>;
}) {
  return editMinPlayersErrors({
    values: values as GameFormValues,
    edit: { ...edit, ...context },
  });
}

describe("editMinPlayersErrors", () => {
  it("저장된 최소 인원보다 정원을 줄이면 정원 칸 오류다", () => {
    expect(errors({ values: { minPlayers: "4", maxPlayers: "3" } })).toEqual({
      maxPlayers: { type: "custom", message: "최소 인원 4명보다 줄일 수 없습니다." },
    });
  });

  it("최소 인원 칸을 직접 고쳤으면 정원 칸 오류가 아니다", () => {
    expect(errors({ values: { minPlayers: "5", maxPlayers: "3" } })).toEqual({});
  });

  it("신청자가 있으면 올리는 것을 최소 인원 칸 오류로 막는다", () => {
    expect(
      errors({ values: { minPlayers: "5", maxPlayers: "6" }, context: { applicantCount: 1 } }),
    ).toEqual({
      minPlayers: { type: "custom", message: "신청자가 있어 올릴 수 없습니다." },
    });
  });

  it("신청자가 있어도 낮추거나 비우는 것은 허용한다", () => {
    const context = { applicantCount: 2 };
    expect(errors({ values: { minPlayers: "3", maxPlayers: "6" }, context })).toEqual({});
    expect(errors({ values: { minPlayers: "", maxPlayers: "6" }, context })).toEqual({});
  });

  it("신청자가 없으면 올리는 것을 허용한다", () => {
    expect(errors({ values: { minPlayers: "5", maxPlayers: "6" } })).toEqual({});
  });

  it("범위 밖 값은 스키마 오류에 맡긴다", () => {
    expect(errors({ values: { minPlayers: "0", maxPlayers: "6" } })).toEqual({});
  });
});
