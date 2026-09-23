import { Avatar, Badge, Button, HStack, Text } from "@roll-and-call/ui";
import { Clock, Users } from "lucide-react";

export const RecruitMetaRow = () => (
  <HStack gap="150" align="center">
    <HStack gap="050" align="center">
      <Users size={14} className="text-gray-500" />
      <Text typography="body4" foreground="muted">
        정원 4/6
      </Text>
    </HStack>
    <HStack gap="050" align="center">
      <Clock size={14} className="text-gray-500" />
      <Text typography="body4" foreground="muted">
        토요일 오후 2시
      </Text>
    </HStack>
  </HStack>
);

export const StatusBadgeRow = () => (
  <HStack gap="075">
    <Badge colorPalette="primary">모집 중</Badge>
    <Badge colorPalette="success">확정</Badge>
    <Badge>대기</Badge>
  </HStack>
);

export const HeaderActionRow = () => (
  <HStack justify="between" align="center" gap="200">
    <Text typography="subtitle1" weight="bold">
      참여자 관리
    </Text>
    <Button size="sm" variant="outline">
      명단 내보내기
    </Button>
  </HStack>
);

export const ApplicantAvatarRow = () => (
  <HStack gap="100" align="center">
    <Avatar name="달빛" size="sm" />
    <Avatar name="새벽" size="sm" />
    <Avatar name="파도" size="sm" />
    <Text typography="body4" foreground="hint">
      외 3명
    </Text>
  </HStack>
);
