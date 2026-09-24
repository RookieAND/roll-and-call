import { withQuery } from "@/shared/lib";

import type { UserAction } from "./user-action";
import type { UserDetailTab } from "./user-detail-tab";

interface UserActionTarget {
  tab?: UserDetailTab;
  action: UserAction;
  rulebook?: string;
}

export function userActionHref(userId: string, { tab, action, rulebook }: UserActionTarget) {
  return withQuery(`/users/${userId}`, {}, { tab, action, rulebook });
}
