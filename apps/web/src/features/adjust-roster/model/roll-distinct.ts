export const DIE_FACES = 100;

// 같은 값이 나온 사람끼리만 다시 굴리고, 다른 사람의 값은 건드리지 않는다.
// 면 수보다 사람이 많으면 겹칠 수밖에 없어 그대로 둔다. 순서는 적용할 때 신청 순으로 가른다.
export function rollDistinct(count: number, roll: () => number): number[] {
  const values = Array.from({ length: count }, () => roll());
  if (count > DIE_FACES) return values;

  const isTied = (index: number) =>
    values.some((value, other) => other !== index && value === values[index]);
  let tied = values.map((_, index) => index).filter(isTied);
  while (tied.length > 0) {
    for (const index of tied) values[index] = roll();
    tied = tied.filter(isTied);
  }
  return values;
}
