import { MyPageAccountSkeleton } from "./my-page-account-skeleton";
import { MyPageBlockSkeleton } from "./my-page-block-skeleton";
import { MyPageSummarySkeleton } from "./my-page-summary-skeleton";

export function MyPageLoading() {
  return (
    <>
      <MyPageSummarySkeleton />
      <MyPageBlockSkeleton titleWidth={64} height={120} />
      <MyPageBlockSkeleton titleWidth={40} height={96} />
      <MyPageAccountSkeleton />
    </>
  );
}
