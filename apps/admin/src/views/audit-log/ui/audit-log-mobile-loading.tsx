import { Grid, Skeleton, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion, SkeletonListRows } from "@/shared/ui";

export function AuditLogMobileLoading() {
  return (
    <>
      <AdminHeader title="활동 기록" />
      <LoadingRegion label="활동 기록을 불러오는 중입니다">
        <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
          <Skeleton width="100%" height={44} rounded={400} />
          <Grid cols={2} className="gap-100">
            <Skeleton width="100%" height={44} rounded={400} />
            <Skeleton width="100%" height={44} rounded={400} />
          </Grid>
        </VStack>
        <SkeletonListRows rows={8} meta />
      </LoadingRegion>
    </>
  );
}
