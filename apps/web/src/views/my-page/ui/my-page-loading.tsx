import { VStack } from "@roll-and-call/ui";

import { MyPageAccountSkeleton } from "./my-page-account-skeleton";
import { MyPageBlockSkeleton } from "./my-page-block-skeleton";
import { MyPageSummarySkeleton } from "./my-page-summary-skeleton";

export function MyPageLoading() {
  return (
    <>
      <MyPageSummarySkeleton />
      <MyPageBlockSkeleton titleWidth={40} height={124} />
      <MyPageBlockSkeleton titleWidth={64} height={238} />
      <MyPageBlockSkeleton titleWidth={40} height={97} />
      <MyPageAccountSkeleton />
    </>
  );
}

export function MyPagePanelLoading() {
  return (
    <VStack gap="225" className="rounded-700 border border-gray-200 bg-surface p-200">
      <MyPageBlockSkeleton titleWidth={24} height={40} />
      <MyPageBlockSkeleton titleWidth={60} height={130} />
      <MyPageBlockSkeleton titleWidth={40} height={242} />
    </VStack>
  );
}
