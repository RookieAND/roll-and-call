import "server-only";
import { rulebookLabel } from "./rulebook-label";
import { loadSnapshot } from "./snapshot";

const NINETY_DAYS = 90 * 86_400_000;

export interface CertifiedGm {
  userId: string;
  nickname: string;
  approvedAt: Date;
  recentSessionCount: number;
}

export async function getRulebookDetail(id: string) {
  const db = await loadSnapshot();
  const rulebook = db.rulebooks.find((candidate) => candidate.id === id);
  if (!rulebook) return null;
  const label = rulebookLabel(rulebook);
  const now = Date.now();
  const certifiedGms: CertifiedGm[] = db.certifications
    .filter((item) => item.rulebook === label)
    .map((item) => ({
      userId: item.userId,
      nickname: db.users.find((user) => user.id === item.userId)?.nickname ?? "",
      approvedAt: item.approvedAt,
      recentSessionCount: db.sessions.filter(
        (session) =>
          session.gmId === item.userId &&
          session.rulebook === label &&
          now - session.startsAt.getTime() < NINETY_DAYS,
      ).length,
    }))
    .toSorted((a, b) => a.approvedAt.getTime() - b.approvedAt.getTime());
  return { ...rulebook, aliases: [...rulebook.aliases], label, certifiedGms };
}

export type RulebookDetail = NonNullable<Awaited<ReturnType<typeof getRulebookDetail>>>;
