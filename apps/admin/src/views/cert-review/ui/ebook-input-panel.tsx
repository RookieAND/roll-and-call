import { HStack, Text } from "@roll-and-call/ui";

import type { CertReview } from "@/shared/server";
import { FactRows, Panel, Tag } from "@/shared/ui";

interface EbookInputPanelProps {
  purchase: CertReview["purchase"];
  sellerRegistered: boolean;
  duplicate: boolean;
}

const NOT_ENTERED = "입력하지 않음";

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
                {sellerRegistered ? <Tag tone="success">등록된 판매처</Tag> : null}
              </HStack>
            ),
          },
          {
            label: "주문번호",
            value: (
              <HStack align="center" gap="075" className="tabular-nums">
                {purchase.orderNumber ?? NOT_ENTERED}
                {duplicate ? <Tag>중복</Tag> : null}
              </HStack>
            ),
          },
          { label: "주문일", value: purchase.orderDate ?? NOT_ENTERED },
        ]}
      />
    </Panel>
  );
}
