import { isNil } from "es-toolkit";

import { NOTIFICATION_CURSOR_SEPARATOR } from "./encode-notification-cursor";

const AT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/;
const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function decodeNotificationCursor(cursor: string | null | undefined) {
  if (isNil(cursor)) return null;
  const [at, id, ...rest] = cursor.split(NOTIFICATION_CURSOR_SEPARATOR);
  if (rest.length > 0 || !AT_PATTERN.test(at ?? "") || !ID_PATTERN.test(id ?? "")) return null;
  return { at, id };
}
