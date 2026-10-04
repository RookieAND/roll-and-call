import "server-only";
import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";

import { MEMBERSHIP_STATUS } from "@/shared/lib";

import { loadSnapshot } from "./snapshot";

// 인증 부여 페이지가 고르는 데 쓰는 것. 고른 책·유저마다 상태는 화면이 계산한다(서플리먼트 규칙은 숨기지 않은 책 전체로).
export async function getGrantOptions() {
  const db = await loadSnapshot();
  const pairOf = ({ userId, rulebookId }: { userId: string; rulebookId: string }) => ({
    userId,
    rulebookId,
  });
  return {
    books: db.rulebooks
      .filter((rulebook) => !rulebook.hidden)
      .map((rulebook) => ({
        id: rulebook.id,
        label: rulebookLabel(rulebook),
        kind: rulebook.kind,
        category: rulebook.category,
        edition: rulebook.edition,
        certRequired: rulebook.certRequired,
        supersedesId: rulebook.supersedesId,
      })),
    members: db.users
      .filter((user) => user.membership === MEMBERSHIP_STATUS.active)
      .map((user) => ({
        id: user.id,
        nickname: user.nickname,
        discordId: user.discordId,
        discordHandle: user.discordHandle,
      })),
    certifications: db.certifications.map(pairOf),
    pending: db.certApplications
      .filter((application) => application.status === "pending")
      .map(pairOf),
    applied: db.certApplications
      .filter((application) => application.status !== "withdrawn")
      .map(pairOf),
  };
}

export type GrantOptions = Awaited<ReturnType<typeof getGrantOptions>>;
