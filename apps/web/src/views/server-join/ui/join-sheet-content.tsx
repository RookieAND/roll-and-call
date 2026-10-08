import { Badge, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import type { JoinScreenStatus } from "../model/join-screen-status";
import { JOIN_SHEET_COPY } from "../model/join-sheet-copy";

interface JoinSheetContentProps {
  status: JoinScreenStatus;
  serverName: string;
  hasInvite: boolean;
  action: ReactNode;
}

export function JoinSheetContent({ status, serverName, hasInvite, action }: JoinSheetContentProps) {
  const { badge, badgePalette, title, body } = JOIN_SHEET_COPY[status]({ serverName, hasInvite });
  return (
    <>
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
    </>
  );
}
