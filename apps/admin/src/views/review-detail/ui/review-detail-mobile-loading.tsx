import { Button, Skeleton, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  KeyValueList,
  LoadingRegion,
  MobileActionBar,
  MobileSection,
  MobileTitle,
} from "@/shared/ui";

const FACT_LABELS = ["작성자", "구인", "작성 시각", "수정 시각", "쓴 후기 · 받은 조치"];

export function ReviewDetailMobileLoading() {
  return (
    <>
      <AdminHeader
        title={
          <MobileTitle
            title="후기 상세"
            sub={<Skeleton width={64} height={12} render={<span />} className="inline-block" />}
          />
        }
        trail={[{ href: "/reviews", label: "후기" }]}
      />
      <LoadingRegion label="후기를 불러오는 중입니다" className="gap-150 px-150 pt-150 pb-200">
        <MobileSection title="후기">
          <VStack gap="075">
            <Skeleton width="100%" height={16} />
            <Skeleton width="80%" height={16} />
            <Skeleton width="60%" height={16} />
          </VStack>
        </MobileSection>
        <MobileSection flush>
          <KeyValueList
            items={FACT_LABELS.map((label) => ({
              label,
              value: <Skeleton width="50%" height={16} />,
            }))}
          />
        </MobileSection>
      </LoadingRegion>
      <MobileActionBar
        primary={
          <Button variant="outline" colorPalette="gray" disabled>
            후기 숨기기
          </Button>
        }
      />
    </>
  );
}
