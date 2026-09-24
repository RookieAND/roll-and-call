import { Button, HStack, Skeleton, TextInput, VStack } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import { AdminHeader, LoadingRegion, Panel, SkeletonItem, SkeletonTable } from "@/shared/ui";

export function RulebooksLoading() {
  return (
    <>
      <AdminHeader title="룰북" sub={<Skeleton width={88} height={12} render={<span />} />} />
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
                    <Skeleton width={48} height={28} rounded={400} />
                    <Skeleton width={84} height={28} rounded={400} />
                  </HStack>
                }
              />
            ))}
          </VStack>
        </Panel>
        <Panel
          title="룰북"
          right={
            <>
              <HStack align="center" className="relative w-[180px]">
                <Search
                  size={14}
                  aria-hidden
                  className="pointer-events-none absolute left-125 text-hint"
                />
                <TextInput
                  type="search"
                  disabled
                  placeholder="룰북 검색"
                  aria-label="룰북 검색"
                  className="h-[32px] pl-400 text-body3"
                />
              </HStack>
              <Button size="sm" disabled>
                룰북 추가
              </Button>
            </>
          }
          className="flex-1"
        >
          <SkeletonTable
            rows={7}
            columns={[
              { label: "룰북", kind: "text", width: "w-[200px]" },
              { label: "판본", kind: "number", width: "w-[78px]", align: "center" },
              { label: "다른 이름", kind: "text" },
              { label: "인증", kind: "badge", width: "w-[120px]", align: "center" },
              { label: "상태", kind: "badge", width: "w-[82px]", align: "center" },
              { label: "인증 GM", kind: "number", width: "w-[84px]", align: "center" },
              { label: "", kind: "icon", width: "w-[44px]", align: "end" },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
