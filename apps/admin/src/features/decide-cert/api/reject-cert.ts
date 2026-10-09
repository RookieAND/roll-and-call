"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { decideCert, getCurrentServer, requireStaff, type ShotKey } from "@/shared/server";

interface RejectCertInput {
  // 고른 반려 사유 이름. 기타면 null이고 userReason이 사유다.
  reasonTag: string | null;
  userReason: string;
  staffMemo: string;
  flaggedShots: ShotKey[];
}

const rejectCertSchema = z.object({
  applicationId: idSchema,
  input: z.object({
    reasonTag: z.string().max(100).nullable(),
    userReason: z.string().max(2000),
    staffMemo: z.string().max(2000),
    flaggedShots: z.array(z.enum(["front", "back", "side"])).max(3),
  }) satisfies z.ZodType<RejectCertInput>,
});

export async function rejectCert(rawApplicationId: string, rawInput: RejectCertInput) {
  const staff = await requireStaff();
  const { applicationId, input } = parseActionInput(rejectCertSchema, {
    applicationId: rawApplicationId,
    input: rawInput,
  });
  if (!input.userReason.trim()) {
    throw new Error("사용자에게 보이는 사유를 입력해 주세요");
  }
  const server = await getCurrentServer();
  const result = await decideCert({
    serverId: server.id,
    id: applicationId,
    actor: staff,
    decision: {
      kind: "reject",
      ...input,
      userReason: input.userReason.trim(),
      staffMemo: input.staffMemo.trim(),
    },
  });
  revalidatePath("/", "layout");
  return result;
}
