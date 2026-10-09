// 추첨·선발 신청은 어디서나 「참여 신청」이라 부른다(R1).
export function joinSuccessMessage({
  waiting,
  application,
}: {
  waiting?: boolean;
  application?: boolean;
}) {
  if (application) return "참여 신청이 접수되었습니다";
  return waiting ? "대기로 접수했습니다" : "참여했습니다";
}
