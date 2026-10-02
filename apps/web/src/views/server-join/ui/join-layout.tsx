import { HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import type { ReactNode } from "react";

import { BrandMark } from "@/entities/profile";

import type { JoinScreenStatus } from "../model/join-screen-status";
import type { JoinTarget } from "../model/join-target";
import { BrowseGamesButton } from "./browse-games-button";
import { JoinBackdrop } from "./join-backdrop";
import { JoinHeader } from "./join-header";
import { JoinSheet } from "./join-sheet";
import { ServerEmblem } from "./server-emblem";

interface JoinLayoutProps {
  target: JoinTarget;
  status: JoinScreenStatus;
  action: ReactNode;
}

// 위 서버 영역은 상태와 상관없이 그대로 두고 아래 시트만 상태에 따라 바뀐다.
export function JoinLayout({ target, status, action }: JoinLayoutProps) {
  return (
    <VStack
      className="relative min-h-dvh overflow-hidden"
      style={{ backgroundImage: "var(--gradient-onboarding)" }}
    >
      <JoinBackdrop />
      <JoinHeader />
      <VStack align="center" justify="center" gap="225" className="relative flex-1 px-300 pb-700">
        <ServerEmblem name={target.name} icon={target.icon} status={status} />
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
        {status === "denied" && (
          <HStack justify="center" className="absolute inset-x-0 bottom-200 px-300">
            <BrowseGamesButton slug={target.slug} />
          </HStack>
        )}
      </VStack>
      <JoinSheet
        status={status}
        serverName={target.name}
        hasInvite={!isNull(target.inviteUrl)}
        action={action}
      />
    </VStack>
  );
}
