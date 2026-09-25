import type { RulebookActionResult } from "@/shared/server";

type Conflict = Extract<RulebookActionResult, { ok: false }>["conflict"];

const CONFLICT_VERB: Record<string, string> = {
  "룰북 추가": "추가",
  "룰북 연결": "기존 룰북에 연결",
  "추가 요청 반려": "반려",
};

export function conflictTitle(conflict: Conflict) {
  if (!conflict) return "이미 처리된 요청입니다";
  return `다른 운영진(${conflict.by})이 먼저 ${CONFLICT_VERB[conflict.action] ?? "처리"}했습니다`;
}
