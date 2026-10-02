"use client";

import { Button } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { RotateCw } from "lucide-react";
import type { ReactNode } from "react";

import { BrandMark } from "@/entities/profile";
import { type JoinStatus, useJoinServer } from "@/features/join-server";

import type { JoinTarget } from "../model/join-target";
import { JoinLayout } from "./join-layout";

interface MemberJoinCheckProps {
  target: JoinTarget;
  next: string;
}

export function MemberJoinCheck({ target, next }: MemberJoinCheckProps) {
  const { status, retry } = useJoinServer({ next });

  const actions: Record<JoinStatus, ReactNode> = {
    checking: (
      <Button colorPalette="discord" size="lg" loading className="w-full">
        확인 중
      </Button>
    ),
    denied: isNull(target.inviteUrl) ? (
      <Button variant="outline" size="lg" disabled className="w-full">
        지금은 초대를 받지 않는 서버입니다
      </Button>
    ) : (
      <Button
        colorPalette="discord"
        size="lg"
        className="w-full"
        render={<a href={target.inviteUrl} target="_blank" rel="noreferrer" />}
      >
        <BrandMark service="discord" size={18} />
        디스코드 서버 참여하기
      </Button>
    ),
    failed: (
      <Button size="lg" className="w-full" onClick={retry}>
        <RotateCw size={17} aria-hidden />
        다시 시도
      </Button>
    ),
  };

  return <JoinLayout target={target} status={status} action={actions[status]} />;
}
