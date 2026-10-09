"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import {
  evaluateBadges,
  getCurrentServer,
  grantCertifications,
  postStaffNotice,
  requireStaff,
  STAFF_NOTICE_KIND,
} from "@/shared/server";

interface GrantUserCertificationsInput {
  rulebookId: string;
  userIds: string[];
  evidence: string;
}

const grantUserCertificationsSchema = z.object({
  rulebookId: idSchema,
  userIds: z.array(idSchema).max(500),
  evidence: z.string().max(2000),
}) satisfies z.ZodType<GrantUserCertificationsInput>;

// 부여 사유는 활동 기록에만 남는다. 당사자 알림(cert_granted)은 grantCertifications가 같은 트랜잭션에서 넣는다.
export async function grantUserCertifications(args: GrantUserCertificationsInput) {
  const staff = await requireStaff();
  const input = parseActionInput(grantUserCertificationsSchema, args);
  const evidence = input.evidence.trim();
  if (!evidence) return { ok: false as const, error: "인증 근거를 입력해 주세요" };
  if (input.userIds.length === 0) return { ok: false as const, error: "인증할 유저를 골라 주세요" };
  const server = await getCurrentServer();
  const result = await grantCertifications({
    serverId: server.id,
    rulebookId: input.rulebookId,
    userIds: input.userIds,
    actor: staff,
    evidence,
  });
  if (!result.ok) return { ok: false as const, error: "인증이 필요 없는 룰북입니다" };
  revalidatePath("/", "layout");
  if (result.granted.length > 0) {
    after(() =>
      evaluateBadges({ serverId: server.id, userIds: result.granted.map((row) => row.userId) }),
    );
    after(() =>
      postStaffNotice({
        server,
        notice: {
          kind: STAFF_NOTICE_KIND.certGranted,
          staffNickname: staff.nickname,
          rulebookId: input.rulebookId,
          rulebookLabel: result.rulebookLabel,
          nicknames: result.granted.map((row) => row.nickname),
        },
      }),
    );
  }
  return {
    ok: true as const,
    rulebookLabel: result.rulebookLabel,
    granted: result.granted,
    skipped: result.skipped,
  };
}
