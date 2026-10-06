// 최소 인원을 채운 수로 세는 추첨 글의 인원. 추첨 전 신청자에 GM이 직접 확정한 사람을 더한다(기획 확인 중인 임시 처리).
export function countMinPlayersPool({
  confirmedCount,
  applicantCount,
}: {
  confirmedCount: number;
  applicantCount: number;
}) {
  return confirmedCount + applicantCount;
}
