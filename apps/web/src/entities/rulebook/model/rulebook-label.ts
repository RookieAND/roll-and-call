// 룰북은 "이름 판본"으로 부른다. 판본이 없으면 이름만.
export function rulebookLabel(rulebook: { name: string; edition: string }) {
  return `${rulebook.name} ${rulebook.edition}`.trim();
}
