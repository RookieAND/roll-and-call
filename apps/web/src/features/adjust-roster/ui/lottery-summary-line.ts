export function lotterySummaryLine({
  deadlinePassed,
  preConfirmedCount,
  poolCount,
  drawCount,
  drawnCount,
}: {
  deadlinePassed: boolean;
  preConfirmedCount: number;
  poolCount: number;
  drawCount: number;
  drawnCount: number;
}) {
  if (!deadlinePassed) return `신청한 ${poolCount}명 중 ${drawnCount}명이 확정됩니다.`;
  if (preConfirmedCount > 0) {
    return `확정 ${preConfirmedCount}명을 뺀 ${drawCount}자리를 신청 ${poolCount}명 중에서 뽑습니다.`;
  }
  return `신청 ${poolCount}명 중 ${drawnCount}명을 뽑습니다.`;
}
