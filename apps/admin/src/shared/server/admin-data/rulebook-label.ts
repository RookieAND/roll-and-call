// 인증·구인은 룰북을 "이름 판본" 글자로 가리킨다.
export function rulebookLabel(rulebook: { name: string; edition: string }) {
  return `${rulebook.name} ${rulebook.edition}`.trim();
}
