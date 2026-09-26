import "server-only";
import { categoryEditions } from "./category-editions";
import { listRulebooks } from "./list-rulebooks";
import { rulebookLabel } from "./rulebook-label";
import { loadSnapshot } from "./snapshot";

const NINETY_DAYS = 90 * 86_400_000;

export interface CertifiedGm {
  userId: string;
  nickname: string;
  approvedAt: Date;
  recentSessionCount: number;
}

// 폼은 카테고리를 고칠 때마다 포함하는 구판 후보를 다시 고르므로 모든 룰북을 함께 넘긴다.
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
  const { rows: allRulebooks } = await listRulebooks();
  const categoryBooks = allRulebooks.filter((row) => row.category === rulebook.category);
  const editions = categoryEditions(categoryBooks);
  return {
    ...rulebook,
    aliases: [...rulebook.aliases],
    label,
    certifiedGms,
    quizQuestions: db.quizQuestions.filter((question) => question.rulebookId === id),
    allRulebooks,
    categoryBooks,
    editions,
  };
}

export type RulebookDetail = NonNullable<Awaited<ReturnType<typeof getRulebookDetail>>>;
