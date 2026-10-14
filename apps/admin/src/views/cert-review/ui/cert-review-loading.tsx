import { Button, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  FactRows,
  KeyHint,
  LoadingRegion,
  NextItemButton,
  skeletonFact,
} from "@/shared/ui";

const SHOT_SLOTS = ["first", "second"] as const;

// 심사 대기 신청뿐 아니라 인증 관리의 「인증 사진 보기」로 승인·반려된 신청도 이 화면으로 온다.
// 신청 방식(실물·전자책·묶음)과 처리 상태를 아직 모르므로 그에 따라 달라지는 글자는 그리지 않는다.
export function CertReviewLoading() {
  return (
    <>
      <AdminHeader
        title="룰북 인증 심사"
        trail={[
          { href: "/cert", label: "룰북 인증" },
          { href: "/cert", label: "심사 대기열" },
        ]}
        actions={<NextItemButton />}
      />
      <LoadingRegion fullBleed label="신청 내용을 불러오는 중입니다">
        <VStack gap="175" className="w-full flex-1 p-200">
          <section className="rounded-600 border border-gray-200 bg-surface">
            <HStack align="center" gap="150" className="px-200 py-175">
              <Skeleton width={40} height={40} rounded="full" />
              <Skeleton width={120} height={20} />
            </HStack>
            <Grid className="grid-cols-2 items-start gap-x-300 border-t border-(--rc-color-border-subtle) px-200 py-100">
              <FactRows labelWidth={72} items={["신청 룰북", "디스코드 ID"].map(skeletonFact)} />
              <FactRows labelWidth={72} items={["신청 일자", "대기"].map(skeletonFact)} />
            </Grid>
          </section>
          <VStack gap="125">
            <HStack align="center" gap="100">
              <Skeleton width={96} height={22} />
              <Skeleton width={72} height={20} rounded="full" className="ml-auto" />
            </HStack>
            <Grid className="grid-cols-2 gap-150">
              {SHOT_SLOTS.map((slot) => (
                <VStack
                  key={slot}
                  className="min-w-0 overflow-hidden rounded-600 border border-gray-200 bg-surface"
                >
                  <VStack gap="075" className="px-150 py-125">
                    <Skeleton width={56} height={18} />
                    <Skeleton width={112} height={14} />
                  </VStack>
                  <Skeleton
                    width="100%"
                    rounded="none"
                    className="h-90 border-y border-(--rc-color-border-subtle)"
                  />
                  <HStack align="center" gap="100" className="px-150 py-125">
                    <Skeleton width={16} height={16} rounded={200} />
                    <Skeleton width="64%" height={14} />
                  </HStack>
                </VStack>
              ))}
            </Grid>
          </VStack>
        </VStack>
        <HStack
          align="center"
          gap="125"
          className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-page py-150"
        >
          <Button variant="outline" colorPalette="gray" size="sm" disabled>
            건너뛰기
          </Button>
          <HStack gap="100" className="ml-auto">
            <Button variant="outline" colorPalette="danger" disabled>
              반려
              <KeyHint keyLabel="R" />
            </Button>
            <Button className="min-w-[112px]" disabled>
              승인
              <KeyHint keyLabel="⏎" />
            </Button>
          </HStack>
        </HStack>
      </LoadingRegion>
    </>
  );
}
