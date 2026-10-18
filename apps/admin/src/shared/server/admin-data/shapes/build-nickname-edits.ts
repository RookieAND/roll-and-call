import type { NicknameEdit } from "../types";
import type { ShapeContext } from "./shape-context";

// 운영진이 닉네임을 바꾸면 활동 기록의 before에 바꾸기 전 닉네임이 남는다. 최근 수정이 먼저다.
export function buildNicknameEdits({ tables }: ShapeContext): NicknameEdit[] {
  return tables.nicknameEditRows
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .flatMap((row) =>
      row.targetUserId && row.before
        ? [{ userId: row.targetUserId, previousNickname: row.before.label }]
        : [],
    );
}
