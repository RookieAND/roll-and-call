import { DISCORD_COLOR, type DiscordEmbedField } from "@roll-and-call/discord";

import { CERT_RESULT_FIELD_NAME, CERT_STAFF_FIELD_NAME } from "./cert-notice-result";

export type RulebookRequestOutcome = "added" | "linked" | "rejected";

const OUTCOME_TEXT = {
  added: "✅ 룰북 추가",
  linked: "🔗 기존 룰북에 연결",
  rejected: "❌ 반려",
} as const;

const OUTCOME_COLOR = {
  added: DISCORD_COLOR.confirmed,
  linked: DISCORD_COLOR.confirmed,
  rejected: DISCORD_COLOR.cancelled,
} as const;

// 요청 알림 임베드에 붙일 결과·처리한 운영진 칸과 색. 사유는 넣지 않는다(D302).
export function rulebookRequestNoticeResult({
  outcome,
  staffNickname,
}: {
  outcome: RulebookRequestOutcome;
  staffNickname: string | null;
}): { fields: DiscordEmbedField[]; color: number } {
  return {
    fields: [
      { name: CERT_RESULT_FIELD_NAME, value: OUTCOME_TEXT[outcome], inline: false },
      { name: CERT_STAFF_FIELD_NAME, value: staffNickname ?? "알 수 없음", inline: false },
    ],
    color: OUTCOME_COLOR[outcome],
  };
}
