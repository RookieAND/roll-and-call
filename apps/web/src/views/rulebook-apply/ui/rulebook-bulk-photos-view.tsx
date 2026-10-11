import { BULK_CERT_MAX_BOOKS } from "@roll-and-call/database/certifications/model";
import { Container } from "@roll-and-call/ui";
import { redirect } from "next/navigation";
import { z } from "zod";

import { profileDisplay } from "@/entities/profile";
import { certApplyHref, toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { BulkCertApplyForm, isBulkSelectable, type BulkQuiz } from "@/features/certify-rulebook";
import { serverPath } from "@/shared/lib";
import {
  getBulkQuizQuestions,
  getCurrentServer,
  getCurrentSessionUser,
  getProfile,
  getRulebookRecords,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";

const rulebookIdsSchema = z.array(z.uuid()).min(2).max(BULK_CERT_MAX_BOOKS);

interface RulebookBulkPhotosViewProps {
  rulebookIds: string[];
}

export async function RulebookBulkPhotosView({ rulebookIds }: RulebookBulkPhotosViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  if (!user) {
    return (
      <>
        <AppBar back="/me/rulebooks" title="인증 신청" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }
  const backToPicker = serverPath({ slug: server.slug, path: certApplyHref({ rulebookIds }) });
  // 주소의 rulebook 값은 아직 검증 전이라, 형식이 틀리면 Postgres 캐스팅 에러 대신 고르기 화면으로 보낸다.
  const parsedIds = rulebookIdsSchema.safeParse([...new Set(rulebookIds)]);
  if (!parsedIds.success) redirect(backToPicker);
  const [records, profile, quizQuestions] = await Promise.all([
    getRulebookRecords({ serverId: server.id, userId: user.id }),
    getProfile(server.id, user.id),
    getBulkQuizQuestions({ serverId: server.id, userId: user.id, rulebookIds: parsedIds.data }),
  ]);
  const data = toMyRulebooks(records);
  if (data.sanction) redirect(serverPath({ slug: server.slug, path: "/me/rulebooks" }));
  const selected = parsedIds.data.flatMap((id) =>
    data.rulebooks.filter((rulebook) => rulebook.id === id),
  );
  const applicable =
    selected.length === parsedIds.data.length &&
    selected.every((rulebook) =>
      isBulkSelectable({ rulebook, rulebooks: data.rulebooks, selectedIds: parsedIds.data }),
    );
  if (!applicable) redirect(backToPicker);

  const quizzes: BulkQuiz[] = quizQuestions.map((quiz) => {
    const book = selected.find((rulebook) => rulebook.id === quiz.rulebookId)!;
    return {
      rulebookId: book.id,
      bookTitle: book.shortName,
      bookSub: `${book.categoryName} ${book.edition}`.trim(),
      question: quiz.question,
    };
  });
  const { name, handle } = profileDisplay({ profile, user });

  return (
    <BulkCertApplyForm
      serverId={server.id}
      rulebooks={selected}
      nickname={handle ?? name}
      quizzes={quizzes}
    />
  );
}
