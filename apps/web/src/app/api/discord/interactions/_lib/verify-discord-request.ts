import { createPublicKey, verify } from "node:crypto";

// raw ed25519 공개키(32바이트)를 SPKI DER로 감싸는 고정 헤더.
const SPKI_ED25519_HEADER = Buffer.from("302a300506032b6570032100", "hex");

// 검증에 성공하면 원문 body를, 실패하면 null을 돌려준다.
export async function verifyDiscordRequest(request: Request) {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) throw new Error("DISCORD_PUBLIC_KEY not set");

  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  const body = await request.text();
  if (!signature || !timestamp) return null;

  const key = createPublicKey({
    key: Buffer.concat([SPKI_ED25519_HEADER, Buffer.from(publicKey, "hex")]),
    format: "der",
    type: "spki",
  });
  const signed = verify(null, Buffer.from(timestamp + body), key, Buffer.from(signature, "hex"));
  return signed ? body : null;
}
