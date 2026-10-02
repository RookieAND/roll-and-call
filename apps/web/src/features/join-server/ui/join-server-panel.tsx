"use client";

import { Button, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useState } from "react";

import { BrandMark } from "@/entities/profile";
import { useAction } from "@/shared/ui";

import { joinServer } from "../api/join-server";
import { GuildMemberRequiredNotice } from "./guild-member-required-notice";

interface JoinServerPanelProps {
  next: string;
  inviteUrl: string | null;
}

export function JoinServerPanel({ next, inviteUrl }: JoinServerPanelProps) {
  const [notGuildMember, setNotGuildMember] = useState(false);
  const { pending, run } = useAction();

  function join() {
    run(() => joinServer({ next }), {
      onSuccess: (result) => setNotGuildMember(Boolean(result.notGuildMember)),
    });
  }

  if (!notGuildMember) {
    return (
      <Button size="lg" className="w-full" loading={pending} onClick={join}>
        가입하기
      </Button>
    );
  }

  return (
    <VStack gap="150">
      <GuildMemberRequiredNotice />
      <VStack gap="075">
        {!isNull(inviteUrl) && (
          <Button
            colorPalette="discord"
            size="lg"
            className="w-full"
            render={<a href={inviteUrl} target="_blank" rel="noreferrer" />}
          >
            <BrandMark service="discord" size={18} />
            디스코드 서버 참여하기
          </Button>
        )}
        <Button variant="outline" size="lg" className="w-full" loading={pending} onClick={join}>
          참여했다면 다시 확인
        </Button>
      </VStack>
    </VStack>
  );
}
