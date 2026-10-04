import type { RulebookKind } from "@roll-and-call/database";
import { uniq } from "es-toolkit";

import type { Snapshot } from "./snapshot";

const NINETY_DAYS = 90 * 86_400_000;

export interface KindImpactLoser {
  userId: string;
  nickname: string;
  recentHostedCount: number;
}

type ImpactRecords = Pick<Snapshot, "rulebooks" | "certifications" | "sessions" | "users">;

// 종류를 바꾸면 그 판본으로 구인을 열 자격을 잃는 사람. 최근 90일에 그 판본 구인을 연 사람이 앞이다.
// 기본 룰북을 다른 종류로 바꾸면 판본에 기본 룰북이 남지 않을 때 그 책을 인증한 사람이 잃는다.
// 다른 종류를 기본 룰북으로 바꾸면 그 판본의 다른 기본 룰북으로 GM이던 사람 가운데 이 책 인증이 없는 사람이 잃는다.
export function kindImpactLosers({
  records,
  rulebookId,
  nextKind,
  now = Date.now(),
}: {
  records: ImpactRecords;
  rulebookId: string;
  nextKind: RulebookKind;
  now?: number;
}): KindImpactLoser[] {
  const book = records.rulebooks.find((candidate) => candidate.id === rulebookId);
  if (!book || (book.kind === "core") === (nextKind === "core")) return [];
  const otherCores = records.rulebooks.filter(
    (candidate) =>
      candidate.id !== book.id &&
      !candidate.hidden &&
      candidate.kind === "core" &&
      candidate.category === book.category &&
      candidate.edition === book.edition,
  );
  const certifiedFor = (id: string) =>
    records.certifications.filter((item) => item.rulebookId === id).map((item) => item.userId);
  const editionSessions = records.sessions.filter(
    (session) =>
      session.rulebookId === book.id || otherCores.some((core) => core.id === session.rulebookId),
  );

  const loserIds = (() => {
    if (book.kind === "core") return otherCores.length ? [] : certifiedFor(book.id);
    if (!book.certRequired || otherCores.length === 0) return [];
    const requiredCores = otherCores.filter((core) => core.certRequired);
    const certifiedAll = requiredCores.length
      ? uniq(requiredCores.flatMap((core) => certifiedFor(core.id))).filter((userId) =>
          requiredCores.every((core) => certifiedFor(core.id).includes(userId)),
        )
      : [];
    const hosts = editionSessions.map((session) => session.gmId);
    const holders = certifiedFor(book.id);
    return uniq([...certifiedAll, ...hosts]).filter((userId) => !holders.includes(userId));
  })();

  return uniq(loserIds)
    .map((userId) => ({
      userId,
      nickname: records.users.find((user) => user.id === userId)?.nickname ?? "알 수 없음",
      recentHostedCount: editionSessions.filter(
        (session) => session.gmId === userId && now - session.startsAt.getTime() < NINETY_DAYS,
      ).length,
    }))
    .toSorted(
      (a, b) =>
        Number(b.recentHostedCount > 0) - Number(a.recentHostedCount > 0) ||
        a.nickname.localeCompare(b.nickname, "ko"),
    );
}
