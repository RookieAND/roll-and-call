import { Button, Callout, Container, FloatingBar, HStack, Text, VStack } from "@roll-and-call/ui";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";

import { toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { getCurrentSessionUser, getRulebookRecords } from "@/shared/server";
import { AppBar, LineBreaks } from "@/shared/ui";

import { myRulebooksHome } from "../model/my-rulebooks-home";
import { EnforcementBanner } from "./enforcement-banner";
import { ListSection } from "./list-section";
import { OwnedCategoryCard } from "./owned-category-card";

const TITLE = "내 룰북";

export async function MyRulebooksView() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me" title={TITLE} />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const data = toMyRulebooks(await getRulebookRecords(user.id));
  const home = myRulebooksHome(data, new Date());
  const applyDisabled = home.suspension !== null;

  return (
    <>
      <AppBar back="/me" title={TITLE} />
      <Container size="sm">
        <VStack gap="250" className="pt-200 pb-250">
          {home.banner && <EnforcementBanner title={home.banner.title} dday={home.banner.dday} />}
          {home.suspension && (
            <Callout.Root colorPalette="danger">
              <Callout.Icon />
              <Callout.Description className="break-keep">
                활동 정지 기간에는 인증을 신청할 수 없습니다.
                <br />
                {home.suspension}
              </Callout.Description>
            </Callout.Root>
          )}
          {home.statusRows.length > 0 && (
            <ListSection title="인증 현황" aside={home.statusSummary} rows={home.statusRows} />
          )}
          {home.owned.length > 0 && (
            <VStack gap="150" render={<section />}>
              <HStack align="baseline" gap="100">
                <Text typography="heading3" render={<h2 />}>
                  인증한 룰북
                </Text>
                <Text typography="body3" weight="medium" foreground="muted">
                  {home.ownedSummary}
                </Text>
              </HStack>
              {home.owned.map((category, index) => (
                <OwnedCategoryCard
                  key={category.key}
                  category={category}
                  defaultOpen={index === 0}
                />
              ))}
            </VStack>
          )}
          {home.requests.length > 0 && (
            <ListSection title="추가 요청한 룰북" rows={home.requests} />
          )}
          {home.empty && (
            <VStack gap="250" className="pt-100">
              <VStack align="center" gap="100" className="px-150 pt-300 pb-100 text-center">
                <span className="mb-075 flex size-16 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  <BookOpen size={30} strokeWidth={1.9} aria-hidden />
                </span>
                <Text typography="heading3" render={<h2 />}>
                  아직 인증한 룰북이 없습니다
                </Text>
                <Text typography="body3" foreground="muted" render={<p />}>
                  구인에 사용할 룰북을 먼저 인증해 주세요.
                </Text>
              </VStack>
              {home.suggestion && !applyDisabled && (
                <Callout.Root colorPalette="primary">
                  <Callout.Description className="break-keep">
                    <LineBreaks lines={home.suggestion.lines} />
                  </Callout.Description>
                  <Callout.Action>
                    <Button render={<Link href={home.suggestion.href} />} size="sm">
                      신청하기
                    </Button>
                  </Callout.Action>
                </Callout.Root>
              )}
            </VStack>
          )}
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            {applyDisabled ? (
              <Button size="lg" disabled className="w-full">
                <Plus size={16} strokeWidth={2.2} aria-hidden />
                인증 신청하기
              </Button>
            ) : (
              <Button render={<Link href="/me/rulebooks/apply" />} size="lg" className="w-full">
                <Plus size={16} strokeWidth={2.2} aria-hidden />
                인증 신청하기
              </Button>
            )}
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
