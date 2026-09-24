import { withQuery } from "@/shared/lib";

import type { UserAction } from "./user-action";
import type { UserDetailTab } from "./user-detail-tab";

interface UserActionTarget {
  tab?: UserDetailTab;
  action: UserAction;
}

export function userActionHref(userId: string, { tab, action }: UserActionTarget) {
  return withQuery(`/users/${userId}`, {}, { tab, action });
}
