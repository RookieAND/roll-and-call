export function splitTarget(target: string) {
  const [name = target, detail] = target.split(" · ");
  return { name, detail };
}
