import { Button, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  ListRowsSkeleton,
  LoadingRegion,
  MobileActionBar,
  MobileTitle,
  UrlFilterChips,
  UrlSearchInput,
} from "@/shared/ui";

import { NO_SHOW_STATUS_CHIPS } from "../model/no-show-status-chips";

export function NoShowsMobileLoading() {
  return (
    <>
      <AdminHeader title={<MobileTitle title="불참 기록" />} />
      <LoadingRegion label="불참 기록을 불러오는 중입니다">
        <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
          <UrlSearchInput placeholder="닉네임 · 세션 검색" />
          <UrlFilterChips param="status" options={NO_SHOW_STATUS_CHIPS} />
        </VStack>
        <ListRowsSkeleton />
      </LoadingRegion>
      <MobileActionBar primary={<Button disabled>불참 기록 추가</Button>} />
    </>
  );
}
