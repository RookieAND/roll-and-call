// "탐정놀이중 · 30일" → 대상과 세부
export function splitTarget(target: string) {
  const [name = target, detail] = target.split(" · ");
  return { name, detail };
}
