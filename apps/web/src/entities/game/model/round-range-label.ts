// 「2회차」「2~6회차」. 번호가 이어진 묶음을 받는다.
export function roundRangeLabel(roundNos: readonly number[]) {
  const first = roundNos[0];
  const last = roundNos.at(-1);
  return first === last ? `${first}회차` : `${first}~${last}회차`;
}
