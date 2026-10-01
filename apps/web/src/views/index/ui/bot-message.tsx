import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { BotIcon } from "./bot-icon";

interface BotMessageProps {
  time: string;
  title: string;
  children: ReactNode;
}

export function BotMessage({ time, title, children }: BotMessageProps) {
  return (
    <HStack gap="125">
      <BotIcon size={32} />
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="center" gap="075">
          <Text typography="subtitle2" weight="extrabold">
            Roll &amp; Call
          </Text>
          <Badge colorPalette="discord" className="px-075 py-025 text-body5">
            앱
          </Badge>
          <Text typography="body4" foreground="hint">
            {time}
          </Text>
        </HStack>
        <Text typography="body4" foreground="muted" render={<p />} className="[text-wrap:pretty]">
          <Text typography="body4" weight="bold" render={<b />}>
            {title}
          </Text>
          <br />
          {children}
        </Text>
      </VStack>
    </HStack>
  );
}
