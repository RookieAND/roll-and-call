type QueryValue = string | undefined | null;

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
