import { CERT_SHOT_LABEL, CERT_STATE, type MyRulebook } from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

// 상세 위쪽 요약 카드의 본문과 작은 글씨. 상태마다 이것과 하단 버튼만 바뀐다.
export function certSummary({ state, stateAt, latestApplication, revokeReason }: MyRulebook) {
  const at = stateAt ? toKst(stateAt) : null;
  if (state === CERT_STATE.certified) {
    return {
      lines: [
        `${at?.format("YYYY.MM.DD")}에 인증을 받았습니다.`,
        "이제 이 룰북으로 구인을 열 수 있습니다.",
      ],
      sub: ["프로필에는 이 룰북의 배지가 공개되어 있습니다."],
    };
  }
  if (state === CERT_STATE.pending) {
    return {
      lines: [
        "운영진이 제출한 사진을 확인하고 있습니다.",
        `${at?.format("MM.DD")}에 신청했으며, 보통 2~3일 안에 확인이 끝납니다.`,
      ],
      sub: [],
    };
  }
  if (state === CERT_STATE.rejected) {
    const reason = latestApplication?.rejectReason?.split("\n").filter(Boolean) ?? [];
    const flagged = (latestApplication?.flaggedShots ?? []).map((shot) => CERT_SHOT_LABEL[shot]);
    return {
      lines: [
        ...reason,
        flagged.length > 0
          ? `문제가 된 ${flagged.join("·")} 사진만 다시 올리면 다시 신청할 수 있습니다.`
          : "사진을 다시 올려 신청해 주세요.",
      ],
      sub: [],
    };
  }
  return {
    lines: [
      `${at?.format("MM.DD")}에 운영진이 인증을 취소했습니다.`,
      ...(revokeReason ? [`취소 사유: ${revokeReason}`] : []),
    ],
    sub: [
      "인증이 취소되기 전에 연 구인은 그대로 진행됩니다.",
      "이 결정에 이의가 있다면 디스코드 #문의 채널에 알려 주세요.",
    ],
  };
}
