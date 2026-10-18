import { REQUEST_KINDS } from "./rulebook-request-form";

export function isRequestKind(value: unknown): value is (typeof REQUEST_KINDS)[number] {
  return REQUEST_KINDS.some((kind) => kind === value);
}
