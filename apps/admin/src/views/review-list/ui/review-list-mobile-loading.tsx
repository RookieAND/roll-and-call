import { VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  SkeletonListRows,
  LoadingRegion,
  MobileTitle,
  UrlFilterChips,
  UrlSearchInput,
} from "@/shared/ui";

import { REVIEW_PHOTO_CHIPS } from "../model/review-photo-chips";
import { ReviewMobileTabs } from "./mobile/review-mobile-tabs";

export function ReviewListMobileLoading() {
  return (
    <>
      <AdminHeader title={<MobileTitle title="후기" />} />
      <ReviewMobileTabs />
      <LoadingRegion label="후기 목록을 불러오는 중입니다">
        <VStack gap="100" className="border-y border-gray-200 bg-surface px-200 py-150">
          <UrlSearchInput placeholder="작성자 · 구인 제목 검색" />
          <UrlFilterChips param="photo" options={REVIEW_PHOTO_CHIPS} allLabel="사진 전체" />
        </VStack>
        <SkeletonListRows sortBar meta />
      </LoadingRegion>
    </>
  );
}
