export const KEYWORD_MAX_COUNT = 3;
export const KEYWORD_MAX_LENGTH = 12;

// 등급도 평가도 아니고 자기 소개의 짧은 형태다. 저장할 때 한 번 다듬어 읽는 화면이 다시 손대지 않게 한다.
export function normalizeKeywords(input: readonly string[]): string[] {
  const keywords: string[] = [];
  for (const raw of input) {
    const keyword = raw.replace(/^#+/, "").replace(/\s+/g, "").slice(0, KEYWORD_MAX_LENGTH);
    if (!keyword || keywords.includes(keyword)) continue;
    keywords.push(keyword);
    if (keywords.length === KEYWORD_MAX_COUNT) break;
  }
  return keywords;
}

// 쉼표·띄어쓰기로도 끊긴다.
export function splitKeywordInput(value: string): string[] {
  return value.split(/[,\s]+/).filter(Boolean);
}
