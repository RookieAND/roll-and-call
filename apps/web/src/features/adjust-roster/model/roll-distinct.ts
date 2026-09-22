import { DIE_FACES } from "@/entities/game";

// 같은 값이 나온 사람끼리만 다시 굴리고, 다른 사람의 값은 건드리지 않는다.
// 면 수보다 사람이 많으면 모두 다른 값을 줄 수 없어 굴리지 않는다. 신청 단계에서 이미 막는다.
export function rollDistinct(count: number, roll: () => number): number[] {
  if (count > DIE_FACES) throw new RangeError(`rollDistinct: ${count} > ${DIE_FACES}`);
  const values = Array.from({ length: count }, () => roll());

  const isTied = (index: number) =>
    values.some((value, other) => other !== index && value === values[index]);
  let tied = values.map((_, index) => index).filter(isTied);
  while (tied.length > 0) {
    for (const index of tied) values[index] = roll();
    tied = tied.filter(isTied);
  }
  return values;
}
