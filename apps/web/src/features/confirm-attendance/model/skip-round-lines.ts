// 회차 생략 확인 창의 본문 줄. 지정형만 회차 수가 줄고, 후기가 있을 때만 후기 줄이 붙는다.
export function skipRoundLines({
  designated,
  roundCount,
  reviewCount,
}: {
  designated: boolean;
  roundCount: number;
  reviewCount: number;
}): string[] {
  return [
    "이 회차는 없던 회차가 됩니다.",
    "출석, 순위, 후기에서 모두 빠지고 뒤 회차 번호가 하나씩 당겨집니다.",
    ...(designated ? [`예정 회차 수가 ${roundCount}회에서 ${roundCount - 1}회로 줄어듭니다.`] : []),
    ...(reviewCount > 0 ? [`이 회차에 작성된 후기 ${reviewCount}건도 함께 지워집니다.`] : []),
    "이 작업은 되돌릴 수 없습니다.",
  ];
}
