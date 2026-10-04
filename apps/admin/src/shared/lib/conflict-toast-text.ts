import { isNull } from "es-toolkit";

import { formatTime } from "./format-time";

interface ConflictToastTextOptions {
  conflict: { by: string; at: Date } | null;
  self: boolean;
  target: string;
}

// 충돌은 창을 닫고 화면을 새로 읽은 뒤(router.refresh) 이 문구로 toast.info를 띄운다(D296).
export function conflictToastText({ conflict, self, target }: ConflictToastTextOptions) {
  if (isNull(conflict) || self) return `이미 처리된 ${target}입니다`;
  return `다른 운영진(${conflict.by})이 ${formatTime(conflict.at)}에 먼저 처리했습니다`;
}
