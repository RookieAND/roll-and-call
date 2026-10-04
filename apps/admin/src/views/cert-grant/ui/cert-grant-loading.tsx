import { Skeleton, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion } from "@/shared/ui";

export function CertGrantLoading() {
  return (
    <>
      <AdminHeader
        title="인증 부여"
        trail={[
          { href: "/cert", label: "룰북 인증" },
          { href: "/cert/manage", label: "인증 관리" },
        ]}
      />
      <LoadingRegion
        label="인증 부여 화면을 불러오는 중입니다"
        className="mx-auto w-full max-w-[1000px] p-200"
      >
        <VStack gap="150" className="rounded-600 border border-gray-200 bg-surface p-250">
          <Skeleton width={160} height={20} />
          <Skeleton height={72} />
          <Skeleton height={72} />
          <Skeleton width={160} height={20} />
          <Skeleton height={40} />
        </VStack>
      </LoadingRegion>
    </>
  );
}
