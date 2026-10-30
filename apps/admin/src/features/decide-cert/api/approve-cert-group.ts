"use server";

import { BULK_CERT_MAX_BOOKS } from "@roll-and-call/database/certifications/model";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";

import { decideCertGroup } from "@/entities/cert/server";
import { idSchema, parseActionInput } from "@/shared/lib";
import {
  evaluateBadges,
  getCurrentServer,
  notifyCanvasCertGranted,
  requireStaff,
  syncCertStaffNotices,
} from "@/shared/server";

const idsSchema = z.array(idSchema).min(1).max(BULK_CERT_MAX_BOOKS);

export async function approveCertGroup(rawApplicationIds: string[]) {
  const staff = await requireStaff();
  const ids = parseActionInput(idsSchema, rawApplicationIds);
  const server = await getCurrentServer();
  const result = await decideCertGroup({
    serverId: server.id,
    ids,
    actor: staff,
    decision: { kind: "approve" },
  });
  revalidatePath("/", "layout");
  if (result.ok && result.decided > 0) {
    after(() => evaluateBadges({ serverId: server.id, userIds: [result.userId] }));
    after(() => syncCertStaffNotices({ server, userId: result.userId }));
    after(() => notifyCanvasCertGranted({ server, userIds: [result.userId] }));
  }
  return result;
}
