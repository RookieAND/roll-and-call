import { MyPageBlockSkeleton } from "./my-page-block-skeleton";

export function MyPageAccountSkeleton() {
  return (
    <>
      <MyPageBlockSkeleton titleWidth={40} height={52} />
      <MyPageBlockSkeleton titleWidth={40} height={104} />
    </>
  );
}
