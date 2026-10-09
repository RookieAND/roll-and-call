"use server";

import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { getApplicationNote, getCurrentServer, requireStaff } from "@/shared/server";

const schema = z.object({ gameId: idSchema, userId: idSchema });

// 운영진이 [신청글 보기]를 눌렀을 때만 본문을 읽는다. 못 읽으면 ok: false다.
export async function fetchApplicationNote(args: {
  gameId: string;
  userId: string;
}): Promise<{ ok: true; note: string } | { ok: false }> {
  await requireStaff();
  const { gameId, userId } = parseActionInput(schema, args);
  const server = await getCurrentServer();
  try {
    const note = await getApplicationNote({ serverId: server.id, gameId, userId });
    return note === null ? { ok: false } : { ok: true, note };
  } catch {
    return { ok: false };
  }
}
