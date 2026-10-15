import type { z } from "zod";

// JSON.parse 결과를 `as`로 단언하지 않고 스키마로 걸러, 깨진 값이면 null을 돌려준다.
export function parseJson<Schema extends z.ZodType>(
  schema: Schema,
  text: string | null,
): z.output<Schema> | null {
  if (text === null) return null;
  try {
    const parsed = schema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
