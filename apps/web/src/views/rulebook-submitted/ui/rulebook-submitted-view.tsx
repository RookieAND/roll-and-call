import { Badge, Button, Card, Container, FloatingBar, Text, VStack } from "@roll-and-call/ui";
import { Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CERT_FORMAT_LABEL, CERT_STATE, toMyRulebooks } from "@/entities/rulebook";
import { getCurrentSessionUser, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";

interface RulebookSubmittedViewProps {
  rulebookId: string;
}

// 신청 완료. 함께 낸 책을 모두 보여 준다.
export async function RulebookSubmittedView({ rulebookId }: RulebookSubmittedViewProps) {
  const user = await getCurrentSessionUser();
  const { rulebooks } = toMyRulebooks(await getRulebookRecords(user?.id ?? null));
  const rulebook = rulebooks.find((candidate) => candidate.id === rulebookId);
  if (!rulebook || rulebook.state !== CERT_STATE.pending) notFound();
  const groupId = rulebook.latestApplication?.groupId;
  const books = groupId
    ? rulebooks.filter(
        (candidate) =>
          candidate.latestApplication?.groupId === groupId &&
          candidate.state === CERT_STATE.pending,
      )
    : [rulebook];

  return (
    <>
      <AppBar back="/me/rulebooks" backIcon="close" title="인증 신청" />
      <Container size="sm">
        <VStack justify="center" gap="300" className="min-h-[70dvh] px-050 py-400">
          <VStack align="center" gap="125" className="text-center">
            <span className="mb-050 flex size-16 items-center justify-center rounded-full bg-success-50 text-success-700">
              <Check size={30} strokeWidth={2.4} aria-hidden />
            </span>
            <Text typography="heading1" render={<h1 />}>
              신청했습니다
            </Text>
            <Text typography="body2" foreground="muted" render={<p />} className="break-keep">
              운영진이 확인하면 내 룰북에서 결과를 볼 수 있습니다.
            </Text>
          </VStack>
          <Card.Root padding="none" className="overflow-hidden">
            {books.map((book) => (
              <div
                key={book.id}
                className="flex min-h-14 items-center gap-125 border-t border-gray-100 px-175 py-100 first:border-t-0"
              >
                <VStack className="min-w-0 flex-1">
                  <Text typography="body2" weight="bold">
                    {book.shortName}
                  </Text>
                  <Text typography="body4" foreground="hint">
                    {`${book.categoryName} ${book.edition}`.trim()}
                    {book.latestApplication &&
                      ` · ${CERT_FORMAT_LABEL[book.latestApplication.format]}`}
                  </Text>
                </VStack>
                <Badge className="flex-none">심사 중</Badge>
              </div>
            ))}
          </Card.Root>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <Button render={<Link href="/me/rulebooks" />} size="lg" className="w-full">
              내 룰북으로
            </Button>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
