import { CERT_REVIEW_TIME, CERT_STATE, type MyRulebook } from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

// 상세 위쪽 요약 카드의 본문과 작은 글씨. 상태마다 이것과 하단 버튼만 바뀐다.
export function certSummary({ state, stateAt, latestApplication, revokeReason }: MyRulebook) {
  const at = stateAt ? toKst(stateAt) : null;
  if (state === CERT_STATE.certified) {
    return {
      lines: [`${at?.format("YYYY.MM.DD")}에 인증됐습니다.`, "이 룰북으로 구인을 열 수 있습니다."],
      sub: ["프로필에 룰북 배지로 공개되고 있습니다."],
    };
  }
  if (state === CERT_STATE.pending) {
    return {
      lines: ["운영진이 확인하고 있습니다.", `${at?.format("MM.DD")} 신청 · ${CERT_REVIEW_TIME}.`],
      sub: [],
    };
  }
  if (state === CERT_STATE.rejected) {
    const reason = latestApplication?.rejectReason?.split("\n").filter(Boolean) ?? [];
    const flagged = (latestApplication?.flaggedShots.length ?? 0) > 0;
    return {
      lines: [
        ...reason,
        flagged ? "문제가 된 사진만 다시 올리면 됩니다." : "사진을 다시 올려 신청해 주세요.",
      ],
      sub: [],
    };
  }
  return {
    lines: [
      `${at?.format("MM.DD")}에 운영진이 인증을 취소했습니다.`,
      ...(revokeReason ? [`사유: ${revokeReason}`] : []),
    ],
    sub: [
      "인증 취소 전에 연 구인은 그대로 진행됩니다.",
      "이의가 있다면 디스코드 #문의 채널로 알려 주세요.",
    ],
  };
}
