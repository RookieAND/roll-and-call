import { DISCORD_COLOR, type DiscordEmbedField } from "@roll-and-call/discord";

import { CERT_RESULT_FIELD_NAME, CERT_STAFF_FIELD_NAME } from "./cert-notice-result";

export type HomebrewNoticeOutcome = "approved" | "rejected" | "withdrawn";

const OUTCOME_TEXT = {
  approved: "✅ 승인",
  rejected: "❌ 반려",
  withdrawn: "↩️ 신청자가 철회",
} as const;

const OUTCOME_COLOR = {
  approved: DISCORD_COLOR.confirmed,
  rejected: DISCORD_COLOR.cancelled,
  withdrawn: DISCORD_COLOR.cancelled,
} as const;

// 자작 룰 신청 알림에 붙일 결과·처리한 운영진 칸과 색. 사유는 넣지 않는다(D302). 철회는 처리한 운영진이 없다.
export function homebrewNoticeResult({
  outcome,
  staffNickname,
}: {
  outcome: HomebrewNoticeOutcome;
  staffNickname: string | null;
}): { fields: DiscordEmbedField[]; color: number } {
  const result = { name: CERT_RESULT_FIELD_NAME, value: OUTCOME_TEXT[outcome], inline: false };
  return {
    fields:
      outcome === "withdrawn"
        ? [result]
        : [
            result,
            { name: CERT_STAFF_FIELD_NAME, value: staffNickname ?? "알 수 없음", inline: false },
          ],
    color: OUTCOME_COLOR[outcome],
  };
}
