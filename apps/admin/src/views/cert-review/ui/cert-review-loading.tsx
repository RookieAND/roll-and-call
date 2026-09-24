import { Button, Grid, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AdminHeader, KeyHint, LoadingRegion, SkeletonEntity, SkeletonItem } from "@/shared/ui";

const SHOTS = [
  { label: "앞면", question: "룰북·판본이 일치하고 쪽지 닉네임이 신청자와 같은가" },
  { label: "뒷면", question: "같은 책의 뒤표지인가" },
  { label: "옆면", question: "실물 책의 책등이 보이는가" },
] as const;

export function CertReviewLoading() {
  return (
    <>
      <AdminHeader
        title="룰북 인증 심사"
        back={{ href: "/cert", label: "심사 대기열" }}
        sub={<Skeleton width={32} height={12} render={<span />} />}
      />
      <LoadingRegion label="심사할 신청을 불러오는 중입니다">
        <VStack gap="175" className="mx-auto w-full max-w-[920px] flex-1 p-200">
          <SkeletonEntity
            facts={[
              "신청 룰북",
              "대기",
              "신청 일자",
              "같은 룰북 반려",
              "연 세션",
              "참여 세션",
              "최근 3개월 불참",
            ]}
          />
          <SkeletonItem />
          <Grid className="grid-cols-3 gap-150">
            {SHOTS.map((shot) => (
              <VStack
                key={shot.label}
                gap="100"
                className="rounded-600 border border-gray-200 bg-surface p-125"
              >
                <Text typography="subtitle2">{shot.label}</Text>
                <Skeleton width="100%" height={200} rounded={400} />
                <HStack align="center" gap="100">
                  <Skeleton width={18} height={18} rounded={100} />
                  <Text typography="body3" foreground="hint">
                    {shot.question}
                  </Text>
                </HStack>
              </VStack>
            ))}
          </Grid>
        </VStack>
        <HStack
          align="center"
          gap="125"
          className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-200 py-150"
        >
          <Button variant="outline" colorPalette="gray" size="sm" disabled>
            건너뛰기
          </Button>
          <Text typography="body4" foreground="hint">
            신청 내용을 불러오면 승인과 반려를 할 수 있습니다
          </Text>
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
