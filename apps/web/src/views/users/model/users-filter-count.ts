import type { UsersFilter } from "./users-filter";

export function usersFilterCount({ cert, host, recruiting }: UsersFilter): number {
  return [cert, host, recruiting].filter(Boolean).length;
}
