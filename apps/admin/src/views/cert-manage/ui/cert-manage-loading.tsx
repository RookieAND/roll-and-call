import { Button, Chip, HStack, TextInput } from "@roll-and-call/ui";
import { Plus, Search } from "lucide-react";

import { CERT_TABS } from "@/shared/lib";
import {
  AdminHeader,
  LoadingRegion,
  Panel,
  RouteTabs,
  SkeletonPager,
  SkeletonSelect,
  SkeletonTable,
} from "@/shared/ui";

export function CertManageLoading() {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <RouteTabs label="룰북 인증 화면" items={CERT_TABS} value="/cert/manage" />
      <LoadingRegion label="인증 관리를 불러오는 중입니다" className="gap-150 p-200">
        <HStack align="center" gap="100">
          <HStack align="center" className="relative w-60">
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
          <div className="w-[180px]">
            <SkeletonSelect label="판본 전체" />
          </div>
          {["전체", "인증됨", "심사 중", "반려됨"].map((label) => (
            <Chip key={label} disabled>
              {label}
            </Chip>
          ))}
          <Button disabled className="ml-auto gap-075">
            <Plus size={16} aria-hidden />
            인증 부여
          </Button>
        </HStack>
        <Panel footer={<SkeletonPager />} className="flex-none">
          <SkeletonTable
            columns={[
              { label: "유저", kind: "text", width: 170, fixed: true },
              { label: "판본", kind: "text", width: 260, fixed: true },
              { label: "인증한 책", kind: "text", width: 300 },
              { label: "상태", kind: "badge", width: 90, fixed: true, align: "center" },
              { label: "최근 변경", kind: "text", width: 120, fixed: true, sorted: true },
              { label: "", kind: "empty", width: 64, fixed: true },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
