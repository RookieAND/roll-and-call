import { withQuery } from "@/shared/lib";

export function revokeHref(userId: string, rulebook?: string) {
  return withQuery(`/users/${userId}/revoke`, {}, { rulebook });
}
