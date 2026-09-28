import { Container, VStack } from "@roll-and-call/ui";
import { redirect } from "next/navigation";

import {
  CERT_STATE,
  certApplyHref,
  RULEBOOK_KIND,
  setOf,
  toMyRulebooks,
} from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { CancelApplicationButton } from "@/features/certify-rulebook";
import { getCurrentSessionUser, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { applicationGroup } from "../model/application-group";
import { toBookResult } from "../model/to-book-result";
import { BookResultSection } from "./book-result-section";
import { RetryBar } from "./retry-bar";

interface RulebookCertViewProps {
  rulebookId: string;
}

// 신청 상세. 함께 낸 책을 권마다 구역으로 나눠 결과를 보여 주고, 아래에 그 상태에서 할 일을 둔다.
export async function RulebookCertView({ rulebookId }: RulebookCertViewProps) {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me/rulebooks" title="신청 상세" />
        <Container size="sm">
          <VStack className="py-300">
            <LoginRequired />
          </VStack>
        </Container>
      </>
    );
  }

  const { rulebooks, sets } = toMyRulebooks(await getRulebookRecords(user.id));
  const rulebook = rulebooks.find((candidate) => candidate.id === rulebookId);
  if (!rulebook?.state) redirect(certApplyHref([rulebookId]));

  const books = applicationGroup(rulebook, rulebooks);
  const results = books.map(toBookResult);
  const pending = books.some((book) => book.state === CERT_STATE.pending);
  const set = rulebook.kind === RULEBOOK_KIND.core ? setOf(rulebook, sets) : null;
  const setGuide =
    set && !set.opened && set.cores.length > 1
      ? `기본 룰북 ${set.cores.length}권이 모두 승인되어야 ${set.label} GM이 될 수 있습니다.`
      : null;

  return (
    <>
      <AppBar back="/me/rulebooks" title="신청 상세" />
      <Container size="sm" className="px-0">
        <VStack className="min-h-[calc(100dvh-var(--rc-size-appbar))]">
          {results.map((result, index) => (
            <BookResultSection
              key={result.id}
              result={result}
              guide={index === 0 ? setGuide : null}
            />
          ))}
          <VStack className="flex-1" />
          {results.map((result) =>
            result.retryHref ? (
              <RetryBar
                key={result.id}
                rulebookId={result.id}
                retryHref={result.retryHref}
                discardable={result.discardable}
              />
            ) : null,
          )}
          {pending && (
            <VStack className="border-t border-gray-200 px-200 pt-150 pb-200">
              <CancelApplicationButton rulebookId={rulebookId} bookCount={books.length} size="lg" />
            </VStack>
          )}
        </VStack>
      </Container>
    </>
  );
}
