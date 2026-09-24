type QueryValue = string | undefined | null;

// 현재 쿼리에서 일부만 바꾼 주소. 빈 값은 지운다.
export function withQuery(
  pathname: string,
  current: Record<string, QueryValue>,
  changes: Record<string, QueryValue>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...current, ...changes })) {
    if (value) params.set(key, value);
  }
  return params.size ? `${pathname}?${params}` : pathname;
}
