// 룰북이 없는 구인은 순위에서 미니룰로 센다(D319). 룰북이 있으면 그 룰 분류의 미니룰 스위치를 따른다.
export function miniRuleOf(game: {
  rulebook: { category: { miniRule: boolean } | null } | null;
}): boolean {
  return game.rulebook?.category?.miniRule ?? true;
}
