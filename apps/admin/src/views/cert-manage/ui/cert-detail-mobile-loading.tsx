import { Button, Skeleton, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  KeyValueList,
  LoadingRegion,
  MobileDetailBar,
  MobileSection,
  MobileTitle,
} from "@/shared/ui";

const LABELS = ["닉네임", "룰북", "판본", "인증 방식", "상태", "처리 일자"];

export function CertDetailMobileLoading() {
  return (
    <>
      <AdminHeader
        title={
          <MobileTitle
            title="인증 상세"
            sub={<Skeleton width={64} height={12} render={<span />} className="inline-block" />}
          />
        }
        trail={[{ href: "/cert/manage", label: "인증 관리" }]}
      />
      <LoadingRegion label="인증 정보를 불러오는 중입니다" className="px-150 pt-150 pb-200">
        <VStack>
          <MobileSection flush>
            <KeyValueList
              items={LABELS.map((label) => ({
                label,
                value: (
                  <Skeleton width={96} height={16} render={<span />} className="inline-block" />
                ),
              }))}
            />
          </MobileSection>
        </VStack>
      </LoadingRegion>
      <MobileDetailBar
        primary={
          <Button variant="outline" colorPalette="gray" disabled>
            활동 기록에서 보기
          </Button>
        }
      />
    </>
  );
}
