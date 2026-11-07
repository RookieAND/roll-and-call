import { CertRouteTabs } from "@/entities/cert";
import { AdminHeader, LoadingRegion, SkeletonListRows } from "@/shared/ui";

export function MakerQueueMobileLoading() {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <CertRouteTabs value="/cert/maker" />
      <LoadingRegion label="심사 대기열을 불러오는 중입니다">
        <SkeletonListRows rows={5} meta />
      </LoadingRegion>
    </>
  );
}
