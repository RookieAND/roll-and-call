import { Chip, HStack, Skeleton, TextInput } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import { MEMBERSHIP_STATUS } from "@/shared/lib";
import { USER_FILTERS } from "@/shared/server";
import { AdminHeader, LoadingRegion, Panel, SkeletonPager, SkeletonTable } from "@/shared/ui";

import { USER_COLUMNS } from "../model/user-columns";
import { MembershipSegment } from "./membership-segment";

export function UsersLoading() {
  return (
    <>
      <AdminHeader title="유저" sub={<Skeleton width={48} height={12} render={<span />} />} />
      <LoadingRegion label="유저 목록을 불러오는 중입니다" className="gap-150 p-200">
        <HStack align="center" gap="125">
          <MembershipSegment value={MEMBERSHIP_STATUS.active} disabled />
          <HStack align="center" className="relative w-[240px] shrink-0">
            <Search
              size={14}
              aria-hidden
              className="pointer-events-none absolute left-125 text-hint"
            />
            <TextInput
              type="search"
              disabled
              placeholder="디스코드 닉네임 검색"
              aria-label="디스코드 닉네임 검색"
              className="pl-400 text-body3"
            />
          </HStack>
          <HStack gap="075" wrap>
            {Object.values(USER_FILTERS).map((label) => (
              <Chip key={label} disabled>
                {label}
              </Chip>
            ))}
          </HStack>
        </HStack>
        <Panel footer={<SkeletonPager />} className="flex-none">
          <SkeletonTable
            columns={[
              ...USER_COLUMNS.map((column) => ({
                label: column.label,
                kind: column.kind,
                width: column.width,
                fixed: true,
                align: "align" in column ? column.align : undefined,
              })),
              { label: "", kind: "empty", width: 0 },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
