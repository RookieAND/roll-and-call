"use server";

import { getApplicationNote, getCurrentServer, requireStaff } from "@/shared/server";

// 운영진이 [신청글 보기]를 눌렀을 때만 본문을 읽는다. 못 읽으면 ok: false다.
export async function fetchApplicationNote({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}): Promise<{ ok: true; note: string } | { ok: false }> {
  await requireStaff();
  const server = await getCurrentServer();
  try {
    const note = await getApplicationNote({ serverId: server.id, gameId, userId });
    return note === null ? { ok: false } : { ok: true, note };
  } catch {
    return { ok: false };
  }
}
