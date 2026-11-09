import { cn, Container, VStack } from "@roll-and-call/ui";
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

// 화면 틀 전체에 primary를 7% 섞는다. 모바일은 기본 면에, 데스크톱은 움푹 들어간 면에 섞는다.
const PAGE_TINT_CLASS =
  "bg-[color-mix(in_oklch,var(--rc-color-bg-primary)_7%,var(--rc-color-bg-canvas-base))] desktop:bg-[color-mix(in_oklch,var(--rc-color-bg-primary)_7%,var(--rc-color-bg-canvas-sunken))]";

export async function MyPageView() {
  const user = await getCurrentSessionUser();
  return (
    <div className={cn(user && PAGE_TINT_CLASS)}>
      <PageShell
        readable
        scrollTop
        appBar={
          <AppBar
            title="마이페이지"
            action={<HelpButton />}
            className={cn(user && "bg-transparent desktop:bg-surface")}
          />
        }
        panel={
          user ? (
            <Suspense fallback={<MyPagePanelLoading />}>
              <MyPageAccount part="panel" />
            </Suspense>
          ) : undefined
        }
      >
        <div className={DESKTOP_CARD_CLASS}>
          <Container size="sm" className="desktop:max-w-none">
            {user ? (
              <VStack gap="250" className="py-225">
                <Suspense fallback={<MyPageSummarySkeleton />}>
                  <MyPageSummary />
                </Suspense>
                <Suspense fallback={<MyPageBlockSkeleton titleWidth={40} height={124} />}>
                  <MyPageBadgesSection />
                </Suspense>
                <Suspense fallback={<MyPageBlockSkeleton titleWidth={64} height={238} />}>
                  <MyPageRulebooksSection />
                </Suspense>
                <Suspense fallback={<MyPageBlockSkeleton titleWidth={40} height={97} />}>
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
    </div>
  );
}
