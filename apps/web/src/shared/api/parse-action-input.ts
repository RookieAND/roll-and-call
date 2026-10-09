import type { z } from "zod";

import { INVALID_REQUEST_MESSAGE } from "./action-messages";
import type { ActionResult } from "./action-result";

export type ParsedActionInput<Data> =
  | { ok: true; data: Data }
  | { ok: false; result: ActionResult };

// 서버 액션 인자는 클라이언트가 바꿔 보낼 수 있다. 타입이 아니라 값을 스키마로 확인한다.
export function parseActionInput<Schema extends z.ZodType>(
  schema: Schema,
  input: unknown,
): ParsedActionInput<z.output<Schema>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, result: { error: INVALID_REQUEST_MESSAGE } };
  return { ok: true, data: parsed.data };
}
