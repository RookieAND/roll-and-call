import { Chip, HStack, Skeleton, TextInput } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import { USER_FILTERS } from "@/shared/server";
import { AdminHeader, LoadingRegion, Panel, SkeletonTable } from "@/shared/ui";

export function UsersLoading() {
  return (
    <>
      <AdminHeader title="유저" sub={<Skeleton width={48} height={12} render={<span />} />} />
      <LoadingRegion label="유저 목록을 불러오는 중입니다" className="gap-150 p-200">
        <HStack align="center" gap="125">
          <HStack align="center" className="relative w-[280px]">
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
              className="h-[36px] pl-400 text-body3"
            />
          </HStack>
          {Object.values(USER_FILTERS).map((label) => (
            <Chip key={label} disabled>
              {label}
            </Chip>
          ))}
        </HStack>
        <Panel title="유저" right={<Skeleton width={72} height={12} />} className="flex-1">
          <SkeletonTable
            columns={[
              { label: "닉네임", kind: "text" },
              { label: "가입일", kind: "date", width: "w-[100px]" },
              { label: "연 세션", kind: "number", width: "w-[74px]", align: "end" },
              { label: "참여 세션", kind: "number", width: "w-[82px]", align: "end" },
              { label: "최근 3개월 불참", kind: "number", width: "w-[112px]", align: "end" },
              { label: "인증 룰북", kind: "number", width: "w-[82px]", align: "end" },
              { label: "상태", kind: "badge", width: "w-[96px]" },
              { label: "제재 종료", kind: "date", width: "w-[92px]" },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
