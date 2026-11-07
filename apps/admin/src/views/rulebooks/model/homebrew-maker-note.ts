import { HOMEBREW_SCOPE_LABEL } from "@roll-and-call/database/homebrew/model";

import type { RulebookRow } from "@/entities/rulebook/server";

// 자작 룰 책 줄의 회색 노트. 제작자가 탈퇴했으면 「제작자 알 수 없음」이다.
export function homebrewMakerNote(homebrew: NonNullable<RulebookRow["homebrew"]>) {
  const maker = homebrew.maker ? `제작자 ${homebrew.maker}` : "제작자 알 수 없음";
  return `${maker} · ${HOMEBREW_SCOPE_LABEL[homebrew.scope]}`;
}
