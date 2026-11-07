import { Grid, HStack, IconButton, Skeleton, Text, VStack } from "@roll-and-call/ui";
import { ArrowUpRight } from "lucide-react";

import { ApproveCard, RejectCard } from "@/features/decide-homebrew";
import { AdminHeader, FactRows, LoadingRegion, NextItemButton, Panel } from "@/shared/ui";

const LINK_COUNT = 2;
const IMAGE_COUNT = 4;

// 경로·패널 제목·조치 카드는 바로 그리고 값만 뼈대다. 조치 버튼은 비활성이다.
export function MakerReviewLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={160} height={24} />}
        trail={[
          { href: "/cert", label: "룰북 인증" },
          { href: "/cert/maker", label: "자작 룰" },
        ]}
        actions={<NextItemButton />}
      />
      <LoadingRegion label="신청을 불러오는 중입니다">
        <Grid className="w-full flex-1 grid-cols-[minmax(0,1fr)_320px] items-start gap-200 p-200">
          <VStack gap="200">
            <Panel title="신청 정보" bodyClassName="px-175">
              <FactRows
                items={[
                  {
                    label: "신청자",
                    value: (
                      <HStack align="center" gap="100">
                        <Skeleton width={24} height={24} rounded="full" />
                        <Skeleton width={72} height={14} />
                      </HStack>
                    ),
                  },
                  { label: "신청 일시", value: <Skeleton width={160} height={14} /> },
                  { label: "룰 이름", value: <Skeleton width={140} height={14} /> },
                  { label: "소개", value: <Skeleton width={320} height={14} /> },
                ]}
              />
            </Panel>
            <Panel title="심사 자료" bodyClassName="p-175">
              <VStack gap="200">
                <VStack gap="100">
                  <Text typography="body4" weight="bold" foreground="muted">
                    링크
                  </Text>
                  {Array.from({ length: LINK_COUNT }, (_, index) => (
                    <HStack
                      key={index}
                      align="center"
                      gap="100"
                      className="h-10 rounded-400 border border-gray-200 bg-canvas pr-050 pl-150"
                    >
                      <Skeleton width="70%" height={14} />
                      <IconButton
                        variant="outline"
                        size="sm"
                        aria-label="새 탭에서 열기"
                        disabled
                        className="ml-auto"
                      >
                        <ArrowUpRight size={16} aria-hidden />
                      </IconButton>
                    </HStack>
                  ))}
                  <Text typography="body4" foreground="hint">
                    열리지 않으면 「자료를 열 수 없음」으로 반려해 주세요.
                  </Text>
                </VStack>
                <VStack gap="100">
                  <Text typography="body4" weight="bold" foreground="muted">
                    이미지
                  </Text>
                  <Grid cols={3} className="gap-100">
                    {Array.from({ length: IMAGE_COUNT }, (_, index) => (
                      <Skeleton key={index} width="100%" height={150} rounded={300} />
                    ))}
                  </Grid>
                </VStack>
              </VStack>
            </Panel>
          </VStack>
          <VStack gap="150">
            <ApproveCard disabled />
            <RejectCard disabled />
          </VStack>
        </Grid>
      </LoadingRegion>
    </>
  );
}
