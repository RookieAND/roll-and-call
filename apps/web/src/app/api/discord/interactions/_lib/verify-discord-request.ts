import { createPublicKey, verify } from "node:crypto";

// raw ed25519 공개키(32바이트)를 SPKI DER로 감싸는 고정 헤더.
const SPKI_ED25519_HEADER = Buffer.from("302a300506032b6570032100", "hex");

// 서명은 맞아도 이보다 오래된 요청은 가로채 다시 보낸 것으로 보고 받지 않는다.
const MAX_REQUEST_AGE_SECONDS = 300;

export async function verifyDiscordRequest(request: Request) {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) throw new Error("DISCORD_PUBLIC_KEY not set");

  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  const body = await request.text();
  if (!signature || !timestamp) return null;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_REQUEST_AGE_SECONDS) return null;

  const key = createPublicKey({
    key: Buffer.concat([SPKI_ED25519_HEADER, Buffer.from(publicKey, "hex")]),
    format: "der",
    type: "spki",
  });
  const signed = verify(null, Buffer.from(timestamp + body), key, Buffer.from(signature, "hex"));
  return signed ? body : null;
}
