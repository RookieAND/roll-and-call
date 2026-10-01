// 열린 리다이렉트를 막는다. 같은 사이트의 상대 경로만 받는다("//host", "/\host"는 다른 호스트로 간다).
export function safeNextPath({ value, fallback }: { value: string | null; fallback: string }) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
