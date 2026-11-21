import type { UsersFilter } from "./users-filter";

// 필터 시트에서 고르는 중인 값. [유저 N명 보기]를 눌러야 주소에 들어간다.
export type FilterDraft = Pick<UsersFilter, "cert" | "host" | "recruiting">;

export const EMPTY_FILTER_DRAFT: FilterDraft = {
  cert: undefined,
  host: undefined,
  recruiting: false,
};
