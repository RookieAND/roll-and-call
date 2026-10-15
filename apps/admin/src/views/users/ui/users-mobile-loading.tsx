import { TextInput, VStack } from "@roll-and-call/ui";

import { MEMBERSHIP_STATUS } from "@/shared/lib";
import { AdminHeader, LoadingRegion, SkeletonListRows } from "@/shared/ui";

import { MembershipTabs } from "./membership-tabs";
import { UserFilterChips } from "./user-filter-chips";

export function UsersMobileLoading() {
  return (
    <>
      <AdminHeader title="유저" />
      <MembershipTabs value={MEMBERSHIP_STATUS.active} disabled />
      <LoadingRegion label="유저 목록을 불러오는 중입니다">
        <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
          <TextInput
            type="search"
            disabled
            placeholder="닉네임 또는 디스코드 ID 검색"
            aria-label="닉네임 또는 디스코드 ID 검색"
            className="text-body3"
          />
          <div className="-mx-200 overflow-x-auto px-200 scrollbar-none">
            <UserFilterChips query={{}} disabled />
          </div>
        </VStack>
        <SkeletonListRows />
      </LoadingRegion>
    </>
  );
}
