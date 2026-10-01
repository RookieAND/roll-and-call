import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { Bell, Clock3, Users } from "lucide-react";

import { BotIcon } from "./bot-icon";
import { BotMessage } from "./bot-message";
import { PreviewCard } from "./preview-card";

export function NoticeSlide() {
  return (
    <>
      <PreviewCard icon={Bell} title="디스코드 알림" wide>
        <VStack gap="175" className="rounded-500 bg-gray-50 p-175">
          <BotMessage time="오후 6:40" title="달빛 여관의 실종자">
            신청이 확정되었습니다.
          </BotMessage>
          <BotMessage time="오후 9:12" title="달빛 여관의 실종자">
            세션이 10월 9일 (목) 20:00으로 확정되었습니다.
          </BotMessage>
        </VStack>
      </PreviewCard>
      <PreviewCard icon={Users} title="신청 결과">
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
      <PreviewCard icon={Clock3} title="마감 알림">
        <HStack gap="100" className="min-w-0">
          <BotIcon size={22} />
          <VStack gap="075" className="min-w-0 flex-1">
            <Text typography="body4" weight="extrabold">
              가능 시간을
              <br />
              알려 주세요
            </Text>
            <HStack align="center" gap="075">
              <Badge colorPalette="warning" className="rounded-full">
                마감 D-2
              </Badge>
              <Text typography="body4" weight="bold" foreground="hint" numeric>
                응답 3/4
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </PreviewCard>
    </>
  );
}
