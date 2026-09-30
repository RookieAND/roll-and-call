import { Container, VStack } from "@roll-and-call/ui";
import { Suspense } from "react";

import { LoginRequired } from "@/features/auth";
import { getCurrentSessionUser } from "@/shared/server";
import { AppBar, HelpButton } from "@/shared/ui";

import { MyPageAccount } from "./my-page-account";
import { MyPageAccountSkeleton } from "./my-page-account-skeleton";
import { MyPageBadgesSection } from "./my-page-badges-section";
import { MyPageBlockSkeleton } from "./my-page-block-skeleton";
import { MyPageReviewsSection } from "./my-page-reviews-section";
import { MyPageRulebooksSection } from "./my-page-rulebooks-section";
import { MyPageSummary } from "./my-page-summary";
import { MyPageSummarySkeleton } from "./my-page-summary-skeleton";

// 구역마다 따로 읽어 먼저 끝난 구역부터 보인다. 구역이 늘어도 느린 구역만 늦게 뜬다.
export async function MyPageView() {
  const user = await getCurrentSessionUser();
  return (
    <>
      <AppBar title="마이페이지" action={<HelpButton />} />
      <Container size="sm">
        {user ? (
          <VStack gap="250" className="py-225">
            <Suspense fallback={<MyPageSummarySkeleton />}>
              <MyPageSummary />
            </Suspense>
            <Suspense fallback={<MyPageBlockSkeleton titleWidth={40} height={124} />}>
              <MyPageBadgesSection />
            </Suspense>
            <Suspense fallback={<MyPageBlockSkeleton titleWidth={64} height={120} />}>
              <MyPageRulebooksSection />
            </Suspense>
            <Suspense fallback={<MyPageBlockSkeleton titleWidth={40} height={96} />}>
              <MyPageReviewsSection />
            </Suspense>
            <Suspense fallback={<MyPageAccountSkeleton />}>
              <MyPageAccount />
            </Suspense>
          </VStack>
        ) : (
          <VStack className="py-300">
            <LoginRequired />
          </VStack>
        )}
      </Container>
    </>
  );
}
