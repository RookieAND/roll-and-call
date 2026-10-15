"use server";

import { BULK_CERT_MAX_BOOKS } from "@roll-and-call/database/certifications/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { decideCertGroup } from "@/entities/cert/server";
import { idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireStaff } from "@/shared/server";

interface RejectCertGroupInput {
  // 고른 반려 사유 이름. 기타면 null이고 userReason이 사유다.
  reasonTag: string | null;
  userReason: string;
  staffMemo: string;
}

const rejectCertGroupSchema = z.object({
  applicationIds: z.array(idSchema).min(1).max(BULK_CERT_MAX_BOOKS),
  input: z.object({
    reasonTag: z.string().max(100).nullable(),
    userReason: z.string().max(2000),
    staffMemo: z.string().max(2000),
  }) satisfies z.ZodType<RejectCertGroupInput>,
});

// 묶음의 사진은 책 여러 권에 함께 쓰여 사진 한 장을 문제로 지정하지 않는다(flaggedShots 없음).
export async function rejectCertGroup(rawApplicationIds: string[], rawInput: RejectCertGroupInput) {
  const staff = await requireStaff();
  const { applicationIds, input } = parseActionInput(rejectCertGroupSchema, {
    applicationIds: rawApplicationIds,
    input: rawInput,
  });
  if (!input.userReason.trim()) {
    throw new Error("사용자에게 보이는 사유를 입력해 주세요");
  }
  const server = await getCurrentServer();
  const result = await decideCertGroup({
    serverId: server.id,
    ids: applicationIds,
    actor: staff,
    decision: {
      kind: "reject",
      ...input,
      userReason: input.userReason.trim(),
      staffMemo: input.staffMemo.trim(),
      flaggedShots: [],
    },
  });
  revalidatePath("/", "layout");
  return result;
}
