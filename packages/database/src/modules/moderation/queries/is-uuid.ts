const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// 주소에서 온 ID를 uuid 칸과 비교하기 전에 거른다. 형식이 틀리면 Postgres가 오류를 낸다.
export function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}
