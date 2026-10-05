// 신청자가 뽑을 인원 이하이면 추첨 없이 전원 확정한다(D331). 신청자 0명은 추첨할 것이 없으니 해당하지 않는다.
export function shouldSkipLottery({
  applicantCount,
  openSeats,
}: {
  applicantCount: number;
  openSeats: number;
}) {
  return applicantCount >= 1 && applicantCount <= openSeats;
}
