import { Button, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  LoadingRegion,
  MobileActionBar,
  SkeletonListRows,
  SkeletonTabs,
} from "@/shared/ui";

import { USER_DETAIL_MOBILE_TABS } from "../model/user-detail-mobile-tabs";

export function UserDetailMobileLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={96} height={20} render={<span />} />}
        trail={[{ href: "/users", label: "유저" }]}
      />
      <LoadingRegion label="유저 정보를 불러오는 중입니다">
        <VStack className="p-150">
          <VStack gap="150" className="rounded-600 border border-gray-200 bg-surface px-175 py-150">
            <HStack align="center" gap="100">
              <Skeleton width={52} height={22} />
              <Skeleton width={96} height={14} />
            </HStack>
            <Grid className="grid-cols-4 gap-100 border-t border-(--rc-color-border-subtle) pt-150">
              {USER_DETAIL_MOBILE_TABS.map((item) => (
                <VStack key={item.value} gap="050">
                  <Skeleton width={36} height={20} />
                  <Skeleton width={44} height={12} />
                </VStack>
              ))}
            </Grid>
          </VStack>
        </VStack>
        <SkeletonTabs items={USER_DETAIL_MOBILE_TABS.map((item) => item.label)} />
        <SkeletonListRows rows={4} />
      </LoadingRegion>
      <MobileActionBar elevated={false}>
        <HStack gap="100">
          <Button variant="outline" colorPalette="danger" size="lg" disabled className="flex-1">
            제재하기
          </Button>
        </HStack>
      </MobileActionBar>
    </>
  );
}
