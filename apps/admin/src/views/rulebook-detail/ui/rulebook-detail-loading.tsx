import { Button, Field, HStack, Skeleton, TextInput, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion, Panel, SkeletonField, SkeletonTable } from "@/shared/ui";

export function RulebookDetailLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={120} height={22} render={<span />} />}
        sub="룰북 상세"
        back={{ href: "/rules", label: "룰북" }}
        actions={
          <Button variant="outline" colorPalette="gray" size="sm" disabled>
            활동 기록에서 보기
          </Button>
        }
      />
      <LoadingRegion label="룰북 정보를 불러오는 중입니다">
        <VStack gap="150" className="flex-1 p-200">
          <Panel title="기본 정보" bodyClassName="p-175">
            <VStack gap="125">
              <HStack align="start" gap="125">
                <SkeletonField label="룰북 이름" className="flex-1" />
                <SkeletonField label="판본" className="w-[140px]" />
              </HStack>
              <SkeletonField label="다른 이름" />
            </VStack>
          </Panel>
          <Panel title="인증" bodyClassName="p-175">
            <VStack gap="075">
              <Skeleton width="100%" height={64} rounded={500} />
              <Skeleton width="100%" height={64} rounded={500} />
            </VStack>
          </Panel>
          <Panel
            title="이 룰북으로 인증된 GM"
            right={<Skeleton width={40} height={22} rounded="full" />}
            className="flex-1"
          >
            <SkeletonTable
              rows={3}
              columns={[
                { label: "닉네임", kind: "text" },
                { label: "인증일", kind: "date", width: "w-[120px]" },
                { label: "최근 90일 세션", kind: "number", width: "w-[130px]", align: "end" },
                { label: "", kind: "button", width: "w-[110px]", align: "end" },
              ]}
            />
          </Panel>
        </VStack>
        <HStack
          align="end"
          gap="125"
          className="sticky bottom-0 border-t border-gray-200 bg-canvas px-200 py-150"
        >
          <Field.Root
            label="변경 사유"
            htmlFor="rulebook-reason-loading"
            required
            className="flex-1"
          >
            <TextInput
              id="rulebook-reason-loading"
              disabled
              placeholder="기본 정보와 인증 변경을 함께 저장합니다. 사유는 활동 기록에 남습니다"
            />
          </Field.Root>
          <Button variant="outline" colorPalette="gray" disabled>
            숨김 처리
          </Button>
          <Button disabled className="min-w-[96px]">
            저장
          </Button>
        </HStack>
      </LoadingRegion>
    </>
  );
}
