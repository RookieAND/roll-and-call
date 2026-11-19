export const PENDING_NAME_LIMIT = 5;

export function pendingNamesText(names: readonly string[]) {
  const shown = names.slice(0, PENDING_NAME_LIMIT).join(", ");
  const rest = names.length - PENDING_NAME_LIMIT;
  return rest > 0 ? `${shown} 외 ${rest}명` : shown;
}
