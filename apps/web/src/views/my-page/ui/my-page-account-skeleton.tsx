import { MyPageBlockSkeleton } from "./my-page-block-skeleton";

export function MyPageAccountSkeleton() {
  return (
    <>
      <MyPageBlockSkeleton titleWidth={40} height={52} />
      <div className="desktop:hidden">
        <MyPageBlockSkeleton titleWidth={40} height={104} />
      </div>
    </>
  );
}
