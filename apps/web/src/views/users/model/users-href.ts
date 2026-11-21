import { isUndefined } from "es-toolkit";

import { USER_SORT_DEFAULT } from "./user-sort";
import type { UsersFilter } from "./users-filter";

export function usersHref(filter: UsersFilter, page?: number): string {
  const params: Record<string, string | undefined> = {
    q: filter.q,
    cert: filter.cert,
    host: filter.host,
    recruiting: filter.recruiting ? "1" : undefined,
    sort: filter.sort === USER_SORT_DEFAULT ? undefined : filter.sort,
    page: page && page > 1 ? String(page) : undefined,
  };
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (!isUndefined(value)) searchParams.set(key, value);
  }
  const query = searchParams.toString();
  return query ? `/users?${query}` : "/users";
}
