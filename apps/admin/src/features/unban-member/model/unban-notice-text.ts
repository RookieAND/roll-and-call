// 차단을 푼 사람은 서버 멤버가 아니어서 운영진이 직접 전한다(D185). 사유를 고르기 전에는 첫 줄만 보인다.
export function unbanNoticeText(reason: string) {
  const first = "운영진이 서버 차단을 해제했습니다.";
  const trimmed = reason.trim().replace(/\.$/, "");
  return trimmed ? `${first}\n사유: ${trimmed}` : first;
}
