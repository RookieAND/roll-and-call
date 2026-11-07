const HOMEBREW_PERSON_LABEL: Partial<Record<string, string>> = {
  "자작 룰 승인": "제작자",
  "자작 룰 반려": "신청자",
};

const HOMEBREW_SCOPE_CHANGE = "자작 룰 사용 범위 변경";

interface AuditTargetPartsOptions {
  action: string;
  target: string;
  reason: string;
}

// 대상 칸의 굵은 이름과 「 · 」 뒤 세부. 기록은 「{앞} · {뒤}」 한 줄로 남는다.
// 자작 룰 승인·반려는 「{닉네임} · {룰 이름}」을 룰 이름 + 「제작자/신청자 {닉네임}」으로 바꿔 보이고,
// 사용 범위 변경은 사유에 남긴 「{이전}에서 {이후}으로」를 세부로 올리고 목록 사유 칸(reason)은 비운다.
export function auditTargetParts({ action, target, reason }: AuditTargetPartsOptions) {
  const [name = target, detail] = target.split(" · ");
  const personLabel = HOMEBREW_PERSON_LABEL[action];
  if (personLabel && detail) return { name: detail, detail: `${personLabel} ${name}`, reason };
  if (action === HOMEBREW_SCOPE_CHANGE) {
    return { name: target, detail: reason || undefined, reason: "" };
  }
  return { name, detail, reason };
}
