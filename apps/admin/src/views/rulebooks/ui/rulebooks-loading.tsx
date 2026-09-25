import { Button, HStack, Skeleton, TextInput, VStack } from "@roll-and-call/ui";
import { Plus, Search } from "lucide-react";

import {
  AdminHeader,
  LoadingRegion,
  Panel,
  SkeletonItem,
  SkeletonPager,
  SkeletonTable,
} from "@/shared/ui";

export function RulebooksLoading() {
  return (
    <>
      <AdminHeader title="룰북" sub={<Skeleton width={140} height={12} render={<span />} />} />
      <LoadingRegion label="룰북 목록을 불러오는 중입니다" className="gap-150 p-200">
        <Panel
          title="룰북 추가 요청"
          right={<Skeleton width={40} height={22} rounded="full" />}
          bodyClassName="p-150"
        >
          <VStack gap="100">
            {[0, 1].map((index) => (
              <SkeletonItem
                key={index}
                right={
                  <HStack gap="075">
                    <Skeleton width={112} height={28} rounded={400} />
                    <Skeleton width={112} height={28} rounded={400} />
                  </HStack>
                }
              />
            ))}
          </VStack>
        </Panel>
        <Panel
          footer={<SkeletonPager />}
          right={
            <>
              <HStack align="center" className="relative w-[260px]">
                <Search
                  size={14}
                  aria-hidden
                  className="pointer-events-none absolute left-125 text-hint"
                />
                <TextInput
                  type="search"
                  disabled
                  placeholder="이름, 판본, 카테고리, 다른 이름"
                  aria-label="룰북 검색"
                  className="h-[32px] pl-400 text-body3"
                />
              </HStack>
              <Button size="sm" disabled className="gap-050">
                <Plus size={14} aria-hidden />
                룰북 추가
              </Button>
            </>
          }
        >
          <SkeletonTable
            rows={7}
            columns={[
              { label: "룰북", kind: "text", width: 220 },
              { label: "판본", kind: "text", width: 132 },
              { label: "종류", kind: "badge", width: 96, align: "center" },
              { label: "다른 이름", kind: "text", width: 200 },
              { label: "인증", kind: "badge", width: 104, align: "center" },
              { label: "상태", kind: "badge", width: 82, align: "center" },
              { label: "인증 GM", kind: "number", width: 78, align: "center" },
              { label: "", kind: "icon", width: 44, fixed: true, align: "end" },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
