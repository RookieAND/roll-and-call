import {
  Badge,
  Button,
  Card,
  Container,
  FloatingBar,
  HStack,
  Text,
  VStack,
} from "@roll-and-call/ui";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";

import { toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { getCurrentSessionUser, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { categoryCards } from "../model/category-cards";
import { CategoryBookRow } from "./category-book-row";
import { CategoryCard } from "./category-card";
import { RulebookListSection } from "./rulebook-list-section";

export async function MyRulebooksView() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me" title="인증한 룰북" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const { ready, inProgress, requests } = categoryCards(
    toMyRulebooks(await getRulebookRecords(user.id)),
  );
  const inProgressCount = inProgress.length + requests.length;
  const empty = ready.length === 0 && inProgressCount === 0;

  return (
    <>
      <AppBar back="/me" title="인증한 룰북" />
      <Container size="sm">
        {empty ? (
          <VStack
            align="center"
            justify="center"
            gap="100"
            className="min-h-[60dvh] px-200 text-center"
          >
            <span className="mb-075 flex size-16 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <BookOpen size={30} strokeWidth={1.9} aria-hidden />
            </span>
            <Text typography="subtitle1" render={<h2 />}>
              아직 인증한 룰북이 없습니다
            </Text>
            <Text typography="body3" foreground="muted" render={<p />}>
              가지고 있는 실물 룰북을 인증받으면
              <br />그 룰로 GM을 열 수 있습니다.
            </Text>
          </VStack>
        ) : (
          <VStack gap="300" className="pt-225 pb-250">
            {ready.length > 0 && (
              <RulebookListSection title="GM 가능" count={ready.length}>
                {ready.map((card) => (
                  <CategoryCard key={card.id} card={card} />
                ))}
              </RulebookListSection>
            )}
            {inProgressCount > 0 && (
              <RulebookListSection title="진행 중" count={inProgressCount}>
                {inProgress.map((card) => (
                  <CategoryCard key={card.id} card={card} />
                ))}
                {requests.map((request) => (
                  <Card.Root key={request.id} padding="none" className="overflow-hidden">
                    <HStack align="center" gap="100" className="px-175 pt-175 pb-150">
                      <Text
                        typography="subtitle1"
                        weight="extrabold"
                        render={<h3 />}
                        className="min-w-0 flex-1"
                      >
                        {request.label}
                      </Text>
                      <Badge>추가 요청 중</Badge>
                    </HStack>
                    <CategoryBookRow
                      type="requested"
                      title={request.label}
                      kind={request.kind}
                      meta="운영진이 목록에 추가하고 있습니다"
                    />
                  </Card.Root>
                ))}
              </RulebookListSection>
            )}
          </VStack>
        )}
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <Button render={<Link href="/me/rulebooks/apply" />} size="lg" className="w-full">
              <Plus size={16} strokeWidth={2.2} aria-hidden />
              룰북 인증하기
            </Button>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
