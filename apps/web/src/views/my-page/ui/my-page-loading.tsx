import { MyPageAccountSkeleton } from "./my-page-account-skeleton";
import { MyPageBlockSkeleton } from "./my-page-block-skeleton";
import { MyPageSummarySkeleton } from "./my-page-summary-skeleton";

// 로그인 확인 전에 쓰는 전체 뼈대. 구역별 뼈대를 순서대로 쌓는다.
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
