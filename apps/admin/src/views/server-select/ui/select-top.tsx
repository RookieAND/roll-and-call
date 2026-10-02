import { Badge, HStack, Text } from "@roll-and-call/ui";
import Image from "next/image";

import { SignOutButton } from "@/features/auth";

interface SelectTopProps {
  nickname: string;
  platformAdmin: boolean;
}

export function SelectTop({ nickname, platformAdmin }: SelectTopProps) {
  return (
    <HStack
      align="center"
      gap="100"
      render={<header />}
      className="h-[64px] shrink-0 border-b border-gray-200 bg-surface px-300"
    >
      <Image src="/logo_light.png" alt="Roll & Call" width={78} height={19} priority />
      <Text
        typography="body4"
        weight="bold"
        foreground="muted"
        className="rounded-200 border border-gray-200 px-075 py-025"
      >
        ADMIN
      </Text>
      <HStack align="center" gap="100" className="ml-auto">
        {platformAdmin ? <Badge colorPalette="gray">플랫폼 관리자</Badge> : null}
        <Text typography="subtitle2">{nickname}</Text>
        <SignOutButton />
      </HStack>
    </HStack>
  );
}
