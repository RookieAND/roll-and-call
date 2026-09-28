// 룰북 카테고리 이름 → 세션후기 포럼의 룰 태그 이름. 없는 룰은 기타로 붙인다.
const RULE_TAG_BY_CATEGORY: Record<string, string> = {
  "크툴루의 부름": "CoC",
  "너냐?!": "너냐?!",
  피아스코: "피아스코",
  "D&D": "DND",
  인세인: "inSANe",
  마기카로기아: "마기카로기아",
  "거점방어 TRPG 좀비라인": "좀비라인",
  언성듀엣: "언성듀엣",
  "여왕을 위하여": "여왕을 위하여",
  "가부키쵸전설RPG 나이트버터플라이": "카나플",
};

export const OTHER_RULE_TAG = "기타";

export function ruleTagName(category: string | null) {
  return (category && RULE_TAG_BY_CATEGORY[category]) || OTHER_RULE_TAG;
}
