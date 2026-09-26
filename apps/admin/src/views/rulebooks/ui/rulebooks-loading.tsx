import { Button, HStack, Skeleton, TextInput } from "@roll-and-call/ui";
import { Plus, Search } from "lucide-react";

import {
  AdminHeader,
  LoadingRegion,
  Panel,
  RouteTabs,
  SkeletonPager,
  SkeletonTable,
} from "@/shared/ui";

import { RULEBOOKS_TAB } from "../model/rulebooks-tab";

// loading은 주소의 탭을 모르므로 첫 탭(룰북 목록)의 뼈대를 그린다.
export function RulebooksLoading() {
  return (
    <>
      <AdminHeader title="룰북" sub={<Skeleton width={140} height={12} render={<span />} />} />
      <RouteTabs
        label="룰북 화면"
        value="/rules"
        items={[
          { label: "룰북 목록", href: "/rules" },
          { label: "추가 요청", href: `/rules?tab=${RULEBOOKS_TAB.requests}` },
          { label: "전자책 판매처", href: `/rules?tab=${RULEBOOKS_TAB.sellers}` },
        ]}
      />
      <LoadingRegion label="룰북 목록을 불러오는 중입니다" className="gap-150 p-200">
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
            rows={10}
            columns={[
              { label: "룰북", kind: "text", width: 320 },
              { label: "판본", kind: "text", width: 120 },
              { label: "종류", kind: "badge", width: 120, align: "center" },
              { label: "", kind: "icon", width: 44, fixed: true, align: "end" },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
