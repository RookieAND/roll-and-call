import { Badge, HStack, IconButton, Text, Tooltip } from "@roll-and-call/ui";
import { Info } from "lucide-react";

// 열린 모습을 보여 주려고 defaultOpen을 쓴다. 실제 화면에서는 hover·focus로 열린다.
export const HelpTrigger = () => (
  <HStack align="center" gap="075" className="py-500">
    <Text typography="body4" foreground="muted">
      추첨 방식
    </Text>
    <Tooltip
      defaultOpen
      content="신청자 중 정원만큼 무작위로 뽑고, 나머지는 대기로 남습니다."
    >
      <IconButton aria-label="추첨 방식 안내">
        <Info size={16} aria-hidden />
      </IconButton>
    </Tooltip>
  </HStack>
);

export const GmBadge = () => (
  <Tooltip defaultOpen content="이 구인은 달빛님이 진행합니다" side="bottom">
    <span>
      <Badge colorPalette="primary">GM</Badge>
    </span>
  </Tooltip>
);
