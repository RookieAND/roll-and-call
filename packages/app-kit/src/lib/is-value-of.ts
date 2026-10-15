// `as const` 객체의 값 유니온을 좁히는 타입 가드를 만든다. `x as Union` 대신 쓴다.
export function isValueOf<const Values extends Record<string, string>>(values: Values) {
  const allowed: ReadonlySet<unknown> = new Set(Object.values(values));
  return (value: unknown): value is Values[keyof Values] => allowed.has(value);
}
