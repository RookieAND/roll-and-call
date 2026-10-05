const ABSENCE_PENALTY = 100;

// 세션 종류와 관계없이 불참 1건마다 뺀다. PL 점수와 GM 점수에서 각각 뺀다.
export function absencePenalty(): number {
  return ABSENCE_PENALTY;
}
