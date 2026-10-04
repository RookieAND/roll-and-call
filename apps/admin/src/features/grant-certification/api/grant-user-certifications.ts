"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import {
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

// 부여 사유는 활동 기록에만 남는다. 당사자 알림(cert_granted)은 grantCertifications가 같은 트랜잭션에서 넣는다.
export async function grantUserCertifications(input: GrantUserCertificationsInput) {
  const staff = await requireStaff();
  const evidence = input.evidence.trim();
  if (!evidence) return { ok: false as const, error: "인증 근거를 입력해 주세요" };
  if (input.userIds.length === 0) throw new Error("인증할 유저를 골라 주세요");
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
