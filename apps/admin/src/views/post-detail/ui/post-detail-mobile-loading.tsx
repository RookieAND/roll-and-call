import { Button, Skeleton, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  KeyValueList,
  ListRowsSkeleton,
  LoadingRegion,
  MobileDetailBar,
  MobileSection,
  MobileTitle,
} from "@/shared/ui";

const SUMMARY_LABELS = ["GM", "룰북", "세션 일시", "플레이타임", "참여", "상태"];

export function PostDetailMobileLoading() {
  return (
    <>
      <AdminHeader
        title={
          <MobileTitle
            title={<Skeleton width={140} height={20} render={<span />} className="inline-block" />}
            sub="구인 상세"
          />
        }
        trail={[{ href: "/posts", label: "구인" }]}
      />
      <LoadingRegion label="구인 상세를 불러오는 중입니다">
        <VStack className="px-150 py-150">
          <MobileSection flush>
            <KeyValueList
              items={SUMMARY_LABELS.map((label) => ({
                label,
                value: <Skeleton width="50%" height={16} />,
              }))}
            />
          </MobileSection>
        </VStack>
        <ListRowsSkeleton />
      </LoadingRegion>
      <MobileDetailBar
        primary={
          <Button variant="outline" colorPalette="gray" disabled>
            구인 숨기기
          </Button>
        }
      />
    </>
  );
}
