import { HStack, Text, VStack } from "@roll-and-call/ui";

import type { CertReview } from "@/entities/cert/server";
import { KeyValueList, Tag } from "@/shared/ui";

const NOT_ENTERED = "입력하지 않음";

interface EbookInputMobileCardProps {
  purchase: CertReview["purchase"];
  sellerRegistered: boolean;
  duplicate: boolean;
}

export function EbookInputMobileCard({
  purchase,
  sellerRegistered,
  duplicate,
}: EbookInputMobileCardProps) {
  return (
    <VStack
      render={<section aria-label="신청자가 입력한 값" />}
      className="rounded-600 border border-gray-200 bg-surface"
    >
      <VStack gap="025" className="border-b border-(--rc-color-border-subtle) px-175 py-150">
        <Text typography="heading3" render={<h2 />}>
          신청자가 입력한 값
        </Text>
        <Text typography="body4" foreground="hint">
          캡처에 보이는 값과 비교합니다
        </Text>
      </VStack>
      <div className="px-175">
        <KeyValueList
          items={[
            {
              label: "판매처",
              value: (
                <HStack align="center" gap="075" wrap render={<span />}>
                  {purchase.seller ?? NOT_ENTERED}
                  {sellerRegistered ? <Tag tone="success">등록된 판매처</Tag> : null}
                </HStack>
              ),
            },
            {
              label: "주문번호",
              value: (
                <HStack align="center" gap="075" wrap render={<span />} className="tabular-nums">
                  {purchase.orderNumber ?? NOT_ENTERED}
                  {duplicate ? <Tag>중복</Tag> : null}
                </HStack>
              ),
            },
            { label: "주문일", value: purchase.orderDate ?? NOT_ENTERED },
          ]}
        />
      </div>
    </VStack>
  );
}
