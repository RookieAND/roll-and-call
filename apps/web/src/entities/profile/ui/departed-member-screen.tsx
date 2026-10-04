import { Avatar, Badge, HStack, Text, VStack } from "@roll-and-call/ui";

import { AppBar, GoBackButton } from "@/shared/ui";

interface DepartedMemberScreenProps {
  name: string;
  avatarUrl: string | null;
}

// 서버를 나간 멤버의 프로필·세션 기록·메모·업적 주소가 모두 이 화면이다(R26, D129).
export function DepartedMemberScreen({ name, avatarUrl }: DepartedMemberScreenProps) {
  return (
    <>
      <AppBar back="/games" title="프로필" />
      <HStack align="center" gap="150" className="px-200 py-250">
        <Avatar src={avatarUrl} name={name} size="lg" className="opacity-50" />
        <Text truncate typography="heading2" render={<h2 />}>
          {name}
        </Text>
        <Badge colorPalette="gray">나감</Badge>
      </HStack>
      <VStack
        align="center"
        justify="center"
        gap="075"
        className="flex-1 border-t border-gray-200 px-300 py-400 text-center"
      >
        <Text typography="subtitle1">탈퇴한 사용자 계정입니다.</Text>
        <Text typography="body3" foreground="muted" render={<p />}>
          지난 세션 기록은 그대로 남아 있습니다.
        </Text>
        <div className="mt-150">
          <GoBackButton fallback="/games" />
        </div>
      </VStack>
    </>
  );
}
