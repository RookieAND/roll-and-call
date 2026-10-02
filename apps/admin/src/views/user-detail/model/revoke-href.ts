export function revokeHref({ userId, rulebookId }: { userId: string; rulebookId: string }) {
  return `/users/${userId}/certs/${rulebookId}/revoke`;
}
