import { SERVER_USER_SORT, type ServerUserSort } from "@roll-and-call/database/profiles/model";

export const USER_SORTS = [
  { key: SERVER_USER_SORT.recent, label: "최근 가입순" },
  { key: SERVER_USER_SORT.name, label: "이름순" },
  { key: SERVER_USER_SORT.rulebooks, label: "인증 룰북 많은 순" },
  { key: SERVER_USER_SORT.recruiting, label: "모집 중인 구인 많은 순" },
] as const satisfies ReadonlyArray<{ key: ServerUserSort; label: string }>;

export const USER_SORT_DEFAULT: ServerUserSort = SERVER_USER_SORT.recent;
