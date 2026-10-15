import { Container, VStack } from "@roll-and-call/ui";
import { Suspense } from "react";

import { LoginRequired } from "@/features/auth";
import { getCurrentSessionUser } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, HelpButton, PageShell } from "@/shared/ui";

import { MyPageAccount } from "./my-page-account";
import { MyPageAccountSkeleton } from "./my-page-account-skeleton";
import { MyPageBadgesSection } from "./my-page-badges-section";
import { MyPageBlockSkeleton } from "./my-page-block-skeleton";
import { MyPagePanelLoading } from "./my-page-loading";
import { MyPageReviewsSection } from "./my-page-reviews-section";
import { MyPageRulebooksSection } from "./my-page-rulebooks-section";
import { MyPageSummary } from "./my-page-summary";
import { MyPageSummarySkeleton } from "./my-page-summary-skeleton";

export async function MyPageView() {
  const user = await getCurrentSessionUser();
  return (
    <PageShell
      appBar={<AppBar title="마이페이지" action={<HelpButton />} />}
      panel={
        user ? (
          <Suspense fallback={<MyPagePanelLoading />}>
            <MyPageAccount part="panel" />
          </Suspense>
        ) : undefined
      }
    >
      <div className={DESKTOP_CARD_CLASS}>
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
                <MyPageAccount part="body" />
              </Suspense>
            </VStack>
          ) : (
            <VStack className="py-300">
              <LoginRequired />
            </VStack>
          )}
        </Container>
      </div>
    </PageShell>
  );
}
