"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import {
  evaluateBadges,
  getCurrentServer,
  notifyGameCancelled,
  postStaffNotice,
  requireStaff,
  revokeCertifications,
  STAFF_NOTICE_KIND,
} from "@/shared/server";

interface RevokeUserCertificationInput {
  userId: string;
  rulebookId: string;
  // 고른 반려 사유 이름. 기타면 null이고 userReason이 사유다.
  reasonTag: string | null;
  userReason: string;
  staffMemo: string;
}

// 그사이 이미 반려·회수됐으면 아무것도 바꾸지 않고 처리한 운영진과 시각을 돌려준다(D296).
// 당사자·구인 참여자 알림은 revokeCertifications가 같은 트랜잭션에서 넣고, 디스코드 글은 커밋 뒤에 올린다.
export async function revokeUserCertification(input: RevokeUserCertificationInput) {
  const staff = await requireStaff();
  const userReason = input.userReason.trim();
  if (!userReason) throw new Error("사용자에게 보이는 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const result = await revokeCertifications({
    serverId: server.id,
    userId: input.userId,
    rulebookId: input.rulebookId,
    actor: staff,
    reasonTag: input.reasonTag,
    userReason,
    staffMemo: input.staffMemo.trim(),
  });
  revalidatePath("/", "layout");
  if (!result.ok) {
    const conflict = result.conflict;
    return {
      ok: false as const,
      conflict: conflict ? { by: conflict.by, at: conflict.at } : null,
      self: conflict?.byId === staff.id,
    };
  }

  after(async () => {
    await evaluateBadges({ serverId: server.id, userIds: [input.userId] });
    for (const game of result.cancelledGames) await notifyGameCancelled({ server, game });
    await postStaffNotice({
      server,
      notice: {
        kind: STAFF_NOTICE_KIND.certRevoked,
        staffNickname: staff.nickname,
        targetUserId: input.userId,
        targetNickname: result.nickname,
        rulebookLabel: result.rulebookLabel,
        cancelledGameCount: result.cancelledGames.length,
      },
    });
  });
  return { ok: true as const };
}
