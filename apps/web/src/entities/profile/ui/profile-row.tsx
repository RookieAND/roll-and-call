import { Avatar, cn, HStack, Text, VStack, type TextProps } from "@trpg/ui";
import type { ReactElement, ReactNode } from "react";

import { PROFILE_ROW_SIZE, type ProfileRowSize } from "../model/profile-row-size";

interface ProfileRowProps {
  name: string | null | undefined;
  avatarUrl: string | null | undefined;
  size?: ProfileRowSize;
  nameAddon?: ReactNode;
  nameRender?: ReactElement<Record<string, unknown>>;
  subline?: ReactNode;
  sublineForeground?: TextProps["foreground"];
  dimmed?: boolean;
  className?: string;
}

// 사람을 가리키는 한 줄. 링크·선택·조작은 호출부가 감싸서 붙인다.
export function ProfileRow({
  name,
  avatarUrl,
  size = "md",
  nameAddon,
  nameRender,
  subline,
  sublineForeground = "muted",
  dimmed = false,
  className,
}: ProfileRowProps) {
  const scale = PROFILE_ROW_SIZE[size];
  const nameForeground = dimmed ? "hint" : "normal";

  return (
    <HStack align="center" gap={scale.gap} className={cn("min-w-0 flex-1", className)}>
      <Avatar src={avatarUrl} name={name} size={scale.avatar} />
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="center" gap="075" className="min-w-0">
          <Text truncate typography={scale.name} foreground={nameForeground} render={nameRender}>
            {name ?? "?"}
          </Text>
          {nameAddon}
        </HStack>
        {subline && (
          <Text truncate typography={scale.subline} foreground={sublineForeground} render={<div />}>
            {subline}
          </Text>
        )}
      </VStack>
    </HStack>
  );
}
