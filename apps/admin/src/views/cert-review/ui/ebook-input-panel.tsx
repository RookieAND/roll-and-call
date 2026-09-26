import { HStack, Text } from "@roll-and-call/ui";
import { CircleCheck, TriangleAlert } from "lucide-react";

import type { CertReview } from "@/shared/server";
import { FactRows, IconBadge, Panel } from "@/shared/ui";

interface EbookInputPanelProps {
  purchase: CertReview["purchase"];
  // 판매처 탭에 등록된 이름인지. 아니면 신청자가 기타로 적은 판매처다.
  sellerRegistered: boolean;
  duplicate: boolean;
}

const NOT_ENTERED = "입력하지 않음";

// 전자책 신청자가 적은 판매처·주문번호·주문일. 아래 캡처에 보이는 값과 나란히 비교한다.
export function EbookInputPanel({ purchase, sellerRegistered, duplicate }: EbookInputPanelProps) {
  return (
    <Panel
      title="신청자가 입력한 값"
      right={
        <Text typography="body4" foreground="hint">
          캡처에 보이는 값과 비교합니다
        </Text>
      }
      bodyClassName="px-175 py-100"
    >
      <FactRows
        labelWidth={72}
        items={[
          {
            label: "판매처",
            value: (
              <HStack align="center" gap="075">
                {purchase.seller ?? NOT_ENTERED}
                {sellerRegistered ? (
                  <IconBadge icon={CircleCheck} colorPalette="success">
                    등록된 판매처
                  </IconBadge>
                ) : null}
              </HStack>
            ),
          },
          {
            label: "주문번호",
            value: (
              <HStack align="center" gap="075" className="tabular-nums">
                {purchase.orderNumber ?? NOT_ENTERED}
                {duplicate ? (
                  <IconBadge icon={TriangleAlert} colorPalette="warning">
                    중복
                  </IconBadge>
                ) : null}
              </HStack>
            ),
          },
          { label: "주문일", value: purchase.orderDate ?? NOT_ENTERED },
        ]}
      />
    </Panel>
  );
}
