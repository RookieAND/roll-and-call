export const KEYWORD_MAX_COUNT = 3;
export const KEYWORD_MAX_LENGTH = 12;

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
