import { isString } from "es-toolkit";

import { USER_FILTERS, type UserFilter } from "./user-filters";

export function isUserFilter(value: unknown): value is UserFilter {
  return isString(value) && Object.hasOwn(USER_FILTERS, value);
}
