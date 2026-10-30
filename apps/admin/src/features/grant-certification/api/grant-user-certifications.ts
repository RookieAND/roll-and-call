"use server";

import { uniq } from "es-toolkit";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import {
  evaluateBadges,
  getCurrentServer,
  grantCertifications,
  notifyCanvasCertGranted,
  postStaffNotice,
  requireStaff,
  STAFF_NOTICE_KIND,
} from "@/shared/server";

interface GrantUserCertificationsInput {
  rulebookIds: string[];
  userIds: string[];
  evidence: string;
}

const grantUserCertificationsSchema = z.object({
  rulebookIds: z.array(idSchema).min(1).max(100),
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
    rulebookIds: input.rulebookIds,
    userIds: input.userIds,
    actor: staff,
    evidence,
  });
  if (!result.ok) return { ok: false as const, error: "인증이 필요 없는 룰북입니다" };
  revalidatePath("/", "layout");
  const grantedBooks = result.books.filter((book) => book.granted.length > 0);
  if (grantedBooks.length > 0) {
    const grantedUserIds = uniq(
      grantedBooks.flatMap((book) => book.granted.map((row) => row.userId)),
    );
    after(() => evaluateBadges({ serverId: server.id, userIds: grantedUserIds }));
    after(() => notifyCanvasCertGranted({ server, userIds: grantedUserIds }));
    // 운영진 채널에는 한 건으로 묶는다. 대상은 한 권이라도 받은 유저 모두다.
    const [firstBook] = grantedBooks;
    if (firstBook) {
      after(() =>
        postStaffNotice({
          server,
          notice: {
            kind: STAFF_NOTICE_KIND.certGranted,
            staffNickname: staff.nickname,
            rulebookId: firstBook.rulebookId,
            rulebookLabel: firstBook.rulebookLabel,
            otherCount: grantedBooks.length - 1,
            nicknames: uniq(
              grantedBooks.flatMap((book) => book.granted.map((row) => row.nickname)),
            ),
          },
        }),
      );
    }
  }
  return { ok: true as const, books: result.books };
}
