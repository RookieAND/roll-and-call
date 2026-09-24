// 0은 빈 칸, 1~5는 가장 많은 칸 대비 비율로 나눈 --color-heat-* 단계다.
export function heatLevel(count: number, max: number) {
  return count && max ? Math.ceil((count / max) * 5) : 0;
}
