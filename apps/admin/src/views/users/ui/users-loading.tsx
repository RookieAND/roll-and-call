import { HStack, TextInput } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import { MEMBERSHIP_STATUS } from "@/shared/lib";
import { USER_SORT_FALLBACK } from "@/shared/server";
import { AdminHeader, LoadingRegion, Panel, SkeletonPager, SkeletonTable } from "@/shared/ui";

import { USER_COLUMNS, USER_STATE_COLUMN } from "../model/user-columns";
import { MembershipTabs } from "./membership-tabs";
import { UserFilterChips } from "./user-filter-chips";

export function UsersLoading() {
  return (
    <>
      <AdminHeader title="유저" />
      <MembershipTabs value={MEMBERSHIP_STATUS.active} disabled />
      <LoadingRegion label="유저 목록을 불러오는 중입니다" className="gap-150 p-200">
        <HStack align="center" gap="125">
          <HStack align="center" className="relative w-60 shrink-0">
            <Search
              size={14}
              aria-hidden
              className="pointer-events-none absolute left-125 text-hint"
            />
            <TextInput
              type="search"
              disabled
              placeholder="닉네임 또는 디스코드 ID 검색"
              aria-label="닉네임 또는 디스코드 ID 검색"
              className="pl-400 text-body3"
            />
          </HStack>
          <UserFilterChips query={{}} disabled />
        </HStack>
        <Panel footer={<SkeletonPager />} className="flex-none">
          <SkeletonTable
            columns={[
              ...[...USER_COLUMNS, USER_STATE_COLUMN].map((column, index) => ({
                label: column.label,
                kind: column.kind,
                width: column.width,
                fixed: index > 0,
                align: "align" in column ? column.align : undefined,
                sorted: "sort" in column && column.sort === USER_SORT_FALLBACK.column,
              })),
              { label: "", kind: "empty", width: 44, fixed: true },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
