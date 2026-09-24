// 신청 버튼 위 한 줄. 모두 채우면 비운다.
export function applyHint(hasRulebook: boolean, photoCount: number) {
  if (!hasRulebook && photoCount < 3) return "룰북을 선택하고 사진 3장을 올려 주세요";
  if (!hasRulebook) return "룰북을 선택해 주세요";
  if (photoCount < 3) return "사진 3장을 모두 올려 주세요";
  return null;
}
