import { SUPPLEMENTS_MAX } from "@roll-and-call/database/games/model";

export function supplementHint({
  full,
  hasOptions,
  editing,
}: {
  full: boolean;
  hasOptions: boolean;
  editing: boolean;
}): string[] {
  if (full) return [`최대 ${SUPPLEMENTS_MAX}권까지 넣을 수 있습니다.`];
  if (editing) {
    return ["신청자가 있어도 바꿀 수 있습니다.", "바꿔도 참여자에게 따로 알리지 않습니다."];
  }
  if (hasOptions) return ["목록에 없는 책은 직접 입력해 주세요."];
  return ["이 룰에 등록된 서플리먼트가 없습니다.", "직접 입력해 주세요."];
}
