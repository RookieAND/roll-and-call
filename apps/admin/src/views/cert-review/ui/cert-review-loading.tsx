import { Button, Checkbox, Grid, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AdminHeader, FactRows, KeyHint, LoadingRegion, SkeletonItem } from "@/shared/ui";

const SHOTS = [
  { label: "앞면", note: "표지 + 닉네임 쪽지", question: "룰북·판본과 쪽지 닉네임이 맞는가" },
  { label: "뒷면", note: "뒤표지", question: "같은 책의 뒤표지인가" },
  { label: "책등", note: "책 옆면의 제목", question: "실물 책이고 제목이 보이는가" },
] as const;

const skeletonFact = (label: string) => ({
  label,
  value: <Skeleton width={96} height={14} render={<span />} className="inline-block" />,
});

export function CertReviewLoading() {
  return (
    <>
      <AdminHeader
        title="룰북 인증 심사"
        sub={<Skeleton width={32} height={12} render={<span />} />}
      />
      <LoadingRegion fullBleed label="심사할 신청을 불러오는 중입니다">
        <VStack gap="175" className="mx-auto w-full max-w-content flex-1 p-200">
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
          <SkeletonItem />
          <VStack gap="125">
            <HStack align="center" gap="100">
              <Text typography="heading3" render={<h2 />}>
                사진 확인
              </Text>
              <Skeleton width={72} height={20} rounded="full" className="ml-auto" />
            </HStack>
            <Grid className="grid-cols-3 gap-150">
              {SHOTS.map((shot) => (
                <VStack
                  key={shot.label}
                  className="min-w-0 overflow-hidden rounded-600 border border-gray-200 bg-surface"
                >
                  <VStack gap="025" className="px-150 py-125">
                    <Text typography="subtitle1">{shot.label}</Text>
                    <Text typography="body4" foreground="hint">
                      {shot.note}
                    </Text>
                  </VStack>
                  <Skeleton width="100%" height={200} rounded="none" />
                  <Checkbox.Field className="px-150 py-125">
                    <Checkbox.Root disabled>
                      <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Checkbox.Label>{shot.question}</Checkbox.Label>
                  </Checkbox.Field>
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
