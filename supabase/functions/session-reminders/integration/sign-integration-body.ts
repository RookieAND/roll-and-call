// 서명 대상은 `${timestamp}.${body}`다. 받는 쪽도 같은 문자열을 HMAC-SHA256(hex)으로 확인한다.
export async function signIntegrationBody({
  secret,
  timestamp,
  body,
}: {
  secret: string;
  timestamp: string;
  body: string;
}) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${body}`));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
