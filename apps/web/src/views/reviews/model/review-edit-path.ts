// 내 후기 고치기 주소. 다회차 후기는 그 회차의 후기 화면으로 간다.
export function reviewEditPath(row: { gameId: string; roundNo: number | null }) {
  const base = `/games/${row.gameId}/review`;
  return row.roundNo ? `${base}?round=${row.roundNo}` : base;
}
