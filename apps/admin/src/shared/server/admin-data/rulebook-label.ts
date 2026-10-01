export function rulebookLabel(rulebook: { name: string; edition: string }) {
  return `${rulebook.name} ${rulebook.edition}`.trim();
}
