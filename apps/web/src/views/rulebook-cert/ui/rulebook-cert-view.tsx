import { Button, Container, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  CERT_STATE,
  certApplyHref,
  RULEBOOK_KIND,
  setOf,
  toMyRulebooks,
} from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { WithdrawApplicationButton } from "@/features/certify-rulebook";
import { serverPath } from "@/shared/lib";
import {
  getCurrentSessionUser,
  getRulebookRecords,
  getCurrentServer,
  signCertPhotoUrls,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { applicationGroup } from "../model/application-group";
import { toBookResult } from "../model/to-book-result";
import { BookResultSection } from "./book-result-section";
import { RetryBar } from "./retry-bar";

interface RulebookCertViewProps {
  rulebookId: string;
}

export async function RulebookCertView({ rulebookId }: RulebookCertViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
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

  const { rulebooks, sets } = toMyRulebooks(
    await getRulebookRecords({ serverId: server.id, userId: user.id }),
  );
  const rulebook = rulebooks.find((candidate) => candidate.id === rulebookId);
  if (!rulebook?.state)
    redirect(serverPath({ slug: server.slug, path: certApplyHref({ rulebookIds: [rulebookId] }) }));

  const books = applicationGroup({ rulebook, rulebooks });
  const signedUrls = await signCertPhotoUrls(
    books.flatMap(({ latestApplication }) =>
      latestApplication
        ? [
            ...Object.values(latestApplication.photoUrls),
            latestApplication.purchaseCaptureUrl,
            latestApplication.receiptUrl,
          ]
        : [],
    ),
  );
  const results = books.map((book) => toBookResult({ rulebook: book, signedUrls }));
  const pending = books.some((book) => book.state === CERT_STATE.pending);
  const allCertified = books.every((book) => book.state === CERT_STATE.certified);
  const set = rulebook.kind === RULEBOOK_KIND.core ? setOf({ rulebook, sets }) : null;
  const setGuide =
    set && !set.opened && set.cores.length > 1
      ? `기본 룰북 ${set.cores.length}권이 모두 승인되어야 ${set.label} GM이 될 수 있습니다.`
      : null;

  return (
    <>
      <AppBar back="/me/rulebooks" title="신청 상세" />
      <Container size="sm" className="px-0">
        <VStack className="min-h-[calc(100dvh-var(--rc-size-appbar)-var(--rc-size-tabbar)-3px)]">
          {results.map((result, index) => (
            <BookResultSection
              key={result.id}
              result={result}
              guide={index === 0 ? setGuide : null}
            />
          ))}
          <VStack className="flex-1" />
          <VStack className="sticky bottom-(--rc-size-tabbar) z-(--rc-z-sticky) bg-surface">
            {results.map((result) =>
              result.retryHref ? (
                <RetryBar
                  key={result.id}
                  rulebookId={result.id}
                  retryHref={serverPath({ slug: server.slug, path: result.retryHref })}
                  discardable={result.discardable}
                />
              ) : null,
            )}
            {allCertified && (
              <VStack className="border-t border-gray-200 px-200 pt-150 pb-200">
                <Button
                  render={
                    <Link
                      href={serverPath({
                        slug: server.slug,
                        path: certApplyHref({ rulebookIds: [] }),
                      })}
                    />
                  }
                  size="lg"
                  className="w-full"
                >
                  다른 룰북 인증하기
                </Button>
              </VStack>
            )}
            {pending && (
              <VStack gap="100" className="border-t border-gray-200 px-200 pt-150 pb-200">
                <Text typography="body4" foreground="muted" className="text-center">
                  운영진이 확인하기 전까지 신청을 취소할 수 있습니다.
                </Text>
                <WithdrawApplicationButton
                  rulebookId={rulebookId}
                  bookCount={books.length}
                  size="lg"
                />
              </VStack>
            )}
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
