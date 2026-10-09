import { z } from "zod";

// Postgres uuid 열과 같은 기준(버전 비트를 따지지 않는다).
export const idSchema = z.guid();

// 서버 액션 인자는 클라이언트가 바꿔 보낼 수 있다. 타입이 아니라 값을 스키마로 확인하고, 어긋나면 던진다.
export function parseActionInput<Schema extends z.ZodType>(
  schema: Schema,
  input: unknown,
): z.output<Schema> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw new Error("잘못된 요청입니다");
  return parsed.data;
}
