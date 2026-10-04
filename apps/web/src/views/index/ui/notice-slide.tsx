import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { Bell, Users } from "lucide-react";

import { NoticePreviewRow } from "./notice-preview-row";
import { PreviewCard } from "./preview-card";

export function NoticeSlide() {
  return (
    <>
      <PreviewCard icon={Bell} title="알림 탭" wide>
        <VStack gap="100">
          <NoticePreviewRow title="달빛 여관의 실종자" time="18:40" unread>
            {" 참여가 확정되었습니다."}
          </NoticePreviewRow>
          <NoticePreviewRow title="달빛 여관의 실종자" sub="10월 9일 (목) 20:00" time="21:12">
            {" 세션 시간이 정해졌습니다."}
          </NoticePreviewRow>
        </VStack>
      </PreviewCard>
      <PreviewCard icon={Users} title="신청 결과" wide>
        <VStack gap="075">
          <HStack align="center" gap="075">
            <Text
              typography="body4"
              weight="bold"
              foreground="muted"
              className="min-w-0 flex-1 truncate"
            >
              달빛 여관
            </Text>
            <Badge colorPalette="success">확정</Badge>
          </HStack>
          <HStack align="center" gap="075">
            <Text
              typography="body4"
              weight="bold"
              foreground="muted"
              className="min-w-0 flex-1 truncate"
            >
              심연의 등대
            </Text>
            <Badge>대기 2번</Badge>
          </HStack>
        </VStack>
      </PreviewCard>
    </>
  );
}
