import { HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import type { ReactNode } from "react";

import { BrandMark } from "@/entities/profile";
import { EntrySheet, ServerStage } from "@/widgets/server-entry";

import { EMBLEM_MARKS } from "../model/emblem-marks";
import type { JoinScreenStatus } from "../model/join-screen-status";
import type { JoinTarget } from "../model/join-target";
import { JoinHeader } from "./join-header";
import { JoinSheetContent } from "./join-sheet-content";

interface JoinLayoutProps {
  target: JoinTarget;
  status: JoinScreenStatus;
  action: ReactNode;
}

export function JoinLayout({ target, status, action }: JoinLayoutProps) {
  return (
    <ServerStage
      name={target.name}
      icon={target.icon}
      mark={EMBLEM_MARKS[status]}
      dimmed={status === "denied"}
      header={<JoinHeader />}
      sheet={
        <EntrySheet>
          <JoinSheetContent
            status={status}
            serverName={target.name}
            hasInvite={!isNull(target.inviteUrl)}
            action={action}
          />
        </EntrySheet>
      }
    >
      <VStack align="center" gap="125" className="text-center">
        <Text
          typography="heading1"
          render={<h1 />}
          className="text-[length:34px] leading-[1.2] tracking-[-0.045em]"
        >
          {target.name}
        </Text>
        <HStack
          align="center"
          gap="075"
          className="h-7 rounded-full border border-(--rc-color-border-subtle) bg-surface/70 px-150"
        >
          <span className="flex text-discord">
            <BrandMark service="discord" size={14} />
          </span>
          <Text typography="body4" weight="bold" foreground="muted">
            디스코드 서버 · 롤앤콜
          </Text>
        </HStack>
      </VStack>
    </ServerStage>
  );
}
