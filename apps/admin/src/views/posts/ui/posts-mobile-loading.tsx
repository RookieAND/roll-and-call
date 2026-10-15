import { VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  ListRowsSkeleton,
  LoadingRegion,
  MobileTitle,
  UrlFilterChips,
  UrlSearchInput,
} from "@/shared/ui";

import { POST_STATUS_CHIPS } from "../model/post-status-chips";

export function PostsMobileLoading() {
  return (
    <>
      <AdminHeader title={<MobileTitle title="구인" />} />
      <LoadingRegion label="구인 목록을 불러오는 중입니다">
        <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
          <UrlSearchInput placeholder="제목 · GM 닉네임 검색" />
          <UrlFilterChips param="status" options={POST_STATUS_CHIPS} />
        </VStack>
        <ListRowsSkeleton />
      </LoadingRegion>
    </>
  );
}
