import { isString } from "es-toolkit";

import { USER_SORTS, USER_SORT_DEFAULT } from "./user-sort";
import type { UsersFilter } from "./users-filter";

const text = (value: unknown) => (isString(value) ? value.trim() || undefined : undefined);

// 알 수 없는 값은 없는 것으로 본다. 룰북 ID 검증은 쿼리가 한다.
export function parseUsersFilter(params: {
  q?: unknown;
  cert?: unknown;
  host?: unknown;
  recruiting?: unknown;
  sort?: unknown;
}): UsersFilter {
  return {
    q: text(params.q),
    cert: text(params.cert),
    host: text(params.host),
    recruiting: params.recruiting === "1",
    sort: USER_SORTS.find((option) => option.key === params.sort)?.key ?? USER_SORT_DEFAULT,
  };
}
