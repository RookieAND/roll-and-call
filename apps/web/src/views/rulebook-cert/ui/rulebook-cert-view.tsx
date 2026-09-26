import { Callout, Container, Text, VStack } from "@roll-and-call/ui";
import { redirect } from "next/navigation";

import { CERT_STATE, certApplyHref, toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { CancelApplicationButton } from "@/features/certify-rulebook";
import { toKst } from "@/shared/lib";
import { getCurrentSessionUser, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { applicationGroup } from "../model/application-group";
import { toBookResult } from "../model/to-book-result";
import { BookResultCard } from "./book-result-card";

interface RulebookCertViewProps {
  rulebookId: string;
}

// 신청 상세. 함께 낸 책을 한 화면에 모아 권마다 결과를 보여 주고, 심사 중인 신청은 거둘 수 있다.
export async function RulebookCertView({ rulebookId }: RulebookCertViewProps) {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me/rulebooks" title="신청 상세" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const { rulebooks } = toMyRulebooks(await getRulebookRecords(user.id));
  const rulebook = rulebooks.find((candidate) => candidate.id === rulebookId);
  if (!rulebook?.state) redirect(certApplyHref([rulebookId]));

  const books = applicationGroup(rulebook, rulebooks);
  const applied = rulebook.latestApplication?.createdAt;
  const certifiedCount = books.filter((book) => book.state === CERT_STATE.certified).length;
  const decided = books.some((book) => book.state !== CERT_STATE.pending);
  const pending = books.some((book) => book.state === CERT_STATE.pending);

  return (
    <>
      <AppBar back="/me/rulebooks" title="신청 상세" />
      <Container size="sm">
        <VStack gap="200" className="pt-225 pb-300">
          {applied && (
            <Text typography="body3" weight="bold" foreground="muted" numeric>
              {toKst(applied).format("YYYY.MM.DD")} 신청 · {books.length}권
            </Text>
          )}
          {books.length > 1 && decided && (
            <Callout.Root>
              <Callout.Description className="font-semibold">
                {books.length}권 중 {certifiedCount}권이 인증됐습니다.
              </Callout.Description>
            </Callout.Root>
          )}
          {books.map((book) => (
            <BookResultCard key={book.id} result={toBookResult(book)} />
          ))}
          {pending && <CancelApplicationButton rulebookId={rulebookId} bookCount={books.length} />}
        </VStack>
      </Container>
    </>
  );
}
