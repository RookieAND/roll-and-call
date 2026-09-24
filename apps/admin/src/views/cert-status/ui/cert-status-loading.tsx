import { Button, Grid, HStack, Skeleton } from "@roll-and-call/ui";

import { CERT_TABS } from "@/shared/lib";
import {
  AdminHeader,
  LoadingRegion,
  Panel,
  RouteTabs,
  SkeletonPager,
  SkeletonSelect,
  SkeletonTable,
  SkeletonTabs,
} from "@/shared/ui";

import { StatTileLoading } from "./stat-tile-loading";

export function CertStatusLoading() {
  return (
    <>
      <AdminHeader title="룰북 인증" sub="인증 현황" />
      <RouteTabs label="룰북 인증 화면" items={CERT_TABS} value="/cert/status" />
      <LoadingRegion label="인증 현황을 불러오는 중입니다" className="gap-150 p-200">
        <Grid className="grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-150">
          <Panel title="전체 진행률" bodyClassName="p-175">
            <HStack align="center" gap="150">
              <Skeleton width={72} height={32} />
              <Skeleton width="100%" height={10} rounded="full" className="flex-1" />
            </HStack>
            <Grid className="mt-150 grid-cols-4 gap-100">
              {["최근 90일 활동 GM", "인증 완료", "심사 대기", "미신청"].map((label) => (
                <StatTileLoading key={label} label={label} />
              ))}
            </Grid>
          </Panel>
          <Panel title="이번 주 처리" bodyClassName="p-175">
            <Grid className="grid-cols-3 gap-100">
              {["승인", "반려", "평균 심사 대기"].map((label) => (
                <StatTileLoading key={label} label={label} />
              ))}
            </Grid>
          </Panel>
        </Grid>
        <Panel className="flex-1" footer={<SkeletonPager />}>
          <SkeletonTabs
            items={["룰북별 인증 현황", "GM별 인증 현황"]}
            right={
              <>
                <div className="w-[162px] [&_[data-slot=select-trigger]]:h-[32px] [&_[data-slot=select-trigger]]:min-h-[32px]">
                  <SkeletonSelect label="최근 90일 활동 GM" />
                </div>
                <Button variant="outline" colorPalette="gray" size="sm" disabled>
                  CSV 내보내기
                </Button>
              </>
            }
          />
          <SkeletonTable
            rows={6}
            columns={[
              { label: "룰북", kind: "text", width: "w-[200px]" },
              { label: "인증된 GM", kind: "number", width: "w-[96px]", align: "center" },
              { label: "심사 대기", kind: "number", width: "w-[88px]", align: "center" },
              { label: "미신청", kind: "number", width: "w-[80px]", align: "center" },
              { label: "진행률", kind: "bar", width: "w-[220px]" },
              { label: "최근 90일 세션", kind: "number", width: "w-[112px]", align: "center" },
              { label: "", kind: "empty" },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
