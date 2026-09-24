import { HStack, Text, VStack } from "@roll-and-call/ui";

import { PENDING_COPY } from "@/shared/lib";
import type { PendingItem } from "@/shared/server";
import { BrandMark, IconTile } from "@/shared/ui";

interface PhoneNoticeProps {
  pendingItems: PendingItem[];
}

// 휴대폰에서는 안내와 건수만 보여 주고 조치할 길은 두지 않는다.
export function PhoneNotice({ pendingItems }: PhoneNoticeProps) {
  return (
    <VStack className="min-h-dvh bg-canvas px-225 py-250">
      <VStack align="center" className="mt-800 text-center">
        <BrandMark size="sm" />
        <Text typography="heading2" render={<h1 />} className="mt-175">
          어드민은 PC에서
          <br />
          이용해 주세요
        </Text>
        <Text typography="body3" foreground="hint" className="mt-100">
          심사와 조치를 하는 화면은 넓은 화면에서만 제대로 보입니다.
        </Text>
      </VStack>
      <VStack
        render={<section aria-label="지금 처리 대기" />}
        className="mt-400 overflow-hidden rounded-600 border border-gray-200 bg-surface"
      >
        <Text
          typography="body4"
          weight="bold"
          foreground="muted"
          className="border-b border-(--rc-color-border-subtle) px-175 py-150"
        >
          지금 처리 대기
        </Text>
        {pendingItems.map((item) => {
          const copy = PENDING_COPY[item.kind];
          return (
            <HStack
              key={item.kind}
              align="center"
              gap="125"
              className="border-b border-(--rc-color-border-subtle) px-175 py-150 last:border-b-0"
            >
              <IconTile icon={copy.icon} size="sm" />
              <Text typography="body3" foreground="muted">
                {copy.label}
              </Text>
              <Text typography="body3" weight="bold" numeric className="ml-auto">
                {item.count}건
              </Text>
            </HStack>
          );
        })}
      </VStack>
      <Text typography="body4" foreground="hint" className="mt-auto pt-300 text-center">
        사용자 앱은 휴대폰에서도 그대로 이용할 수 있습니다
      </Text>
    </VStack>
  );
}
