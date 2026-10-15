import { Button, Chip, HStack, Skeleton, TextInput, VStack } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import { CERT_TABS } from "@/entities/cert";
import { AdminHeader, LoadingRegion, RouteTabs, SkeletonSelect } from "@/shared/ui";

const ROW_COUNT = 6;

export function CertManageMobileLoading() {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <RouteTabs label="룰북 인증 화면" items={CERT_TABS} value="/cert/manage" />
      <LoadingRegion label="인증 기록을 불러오는 중입니다">
        <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
          <HStack align="center" className="relative">
            <Search
              size={14}
              aria-hidden
              className="pointer-events-none absolute left-125 text-hint"
            />
            <TextInput
              type="search"
              disabled
              placeholder="닉네임 또는 디스코드 ID"
              aria-label="닉네임 또는 디스코드 ID"
              className="pl-400 text-body3"
            />
          </HStack>
          <SkeletonSelect label="판본 전체" />
          <HStack gap="075">
            {["전체", "인증됨", "심사 중", "반려됨"].map((label) => (
              <Chip key={label} disabled>
                {label}
              </Chip>
            ))}
          </HStack>
        </VStack>
        <HStack
          align="center"
          className="min-h-11 border-b border-(--rc-color-border-subtle) bg-surface px-200"
        >
          <Skeleton width={32} height={14} />
        </HStack>
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <VStack
            key={index}
            gap="075"
            className="border-b border-(--rc-color-border-subtle) bg-surface px-200 py-175"
          >
            <HStack justify="between">
              <Skeleton width="56%" height={18} />
              <Skeleton width={48} height={20} />
            </HStack>
            <Skeleton width="48%" height={14} />
            <Skeleton width="32%" height={12} />
          </VStack>
        ))}
      </LoadingRegion>
      <VStack className="sticky bottom-0 mt-auto border-t border-gray-200 bg-surface px-150 pt-125 pb-[calc(var(--spacing-150)+var(--rc-safe-bottom))]">
        <Button disabled className="min-h-12 w-full">
          인증 부여
        </Button>
      </VStack>
    </>
  );
}
