import { Badge, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import type { JoinScreenStatus } from "../model/join-screen-status";
import { JOIN_SHEET_COPY } from "../model/join-sheet-copy";

interface JoinSheetProps {
  status: JoinScreenStatus;
  serverName: string;
  hasInvite: boolean;
  action: ReactNode;
}

export function JoinSheet({ status, serverName, hasInvite, action }: JoinSheetProps) {
  const { badge, badgePalette, title, body } = JOIN_SHEET_COPY[status]({ serverName, hasInvite });
  return (
    <VStack
      gap="250"
      aria-live="polite"
      className="relative flex-none rounded-t-800 bg-surface px-300 pt-400 pb-[calc(var(--spacing-300)+var(--rc-safe-bottom))] shadow-[0_-10px_30px_rgb(23_23_28/0.06)]"
    >
      <VStack align="center" gap="125" className="text-center">
        <Badge colorPalette={badgePalette}>{badge}</Badge>
        <Text typography="heading1" render={<h2 />} className="text-pretty">
          {title}
        </Text>
        <Text typography="body2" foreground="muted" render={<p />} className="text-pretty">
          {body.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Text>
      </VStack>
      {action}
    </VStack>
  );
}
