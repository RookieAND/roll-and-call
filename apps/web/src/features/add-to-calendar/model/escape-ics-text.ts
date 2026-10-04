// RFC 5545 TEXT 값: 역슬래시를 먼저 바꿔야 뒤에 붙인 역슬래시가 다시 바뀌지 않는다.
export function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}
