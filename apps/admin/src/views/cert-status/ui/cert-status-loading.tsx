import { Button, Chip, Grid, HStack, Skeleton } from "@roll-and-call/ui";

import { CERT_TABS } from "@/shared/lib";
import {
  AdminHeader,
  LoadingRegion,
  Panel,
  RouteTabs,
  SkeletonPager,
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
        <Panel title="전체 진행률" bodyClassName="p-175">
          <Grid className="grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] items-center gap-200">
            <HStack align="center" gap="150">
              <Skeleton width={72} height={32} />
              <Skeleton width="100%" height={10} rounded="full" className="flex-1" />
            </HStack>
            <Grid className="grid-cols-4 gap-100">
              {["최근 90일 활동 GM", "인증 완료", "심사 대기", "미신청"].map((label) => (
                <StatTileLoading key={label} label={label} />
              ))}
            </Grid>
          </Grid>
        </Panel>
        <Panel footer={<SkeletonPager />}>
          <SkeletonTabs
            items={["룰북별 인증 현황", "GM별 인증 현황"]}
            right={
              <>
                <Chip disabled>미인증 GM 있음</Chip>
                <Chip disabled>전체</Chip>
                <Button variant="outline" colorPalette="gray" size="sm" disabled>
                  CSV 내보내기
                </Button>
              </>
            }
          />
          <SkeletonTable
            rows={6}
            columns={[
              { label: "판본", kind: "text", width: 200 },
              { label: "인증된 GM", kind: "number", width: 96, align: "center" },
              { label: "심사 대기", kind: "number", width: 88, align: "center" },
              { label: "미신청", kind: "number", width: 80, align: "center" },
              { label: "진행률", kind: "bar", width: 220 },
              { label: "최근 90일 세션", kind: "number", width: 112, align: "center" },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
