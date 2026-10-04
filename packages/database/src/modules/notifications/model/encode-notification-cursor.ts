export const NOTIFICATION_CURSOR_SEPARATOR = "~";

// at은 DB가 준 created_at 문자열 그대로다. Date로 바꾸면 마이크로초가 잘려 같은 줄을 다시 읽는다.
export function encodeNotificationCursor({ at, id }: { at: string; id: string }) {
  return `${at}${NOTIFICATION_CURSOR_SEPARATOR}${id}`;
}
