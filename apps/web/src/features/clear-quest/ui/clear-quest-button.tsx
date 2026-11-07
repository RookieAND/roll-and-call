"use client";

import type { OnboardingQuest } from "@roll-and-call/database/onboarding/model";
import { Button, type ButtonProps } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { QUEST_LIST_PATH, useServerPath } from "@/shared/lib";
import { toastActionError, useAction } from "@/shared/ui";

import { clearQuestAction } from "../api/clear-quest-action";
import { CLEAR_TARGET, clearedDestination, type ClearTarget } from "../model/cleared-destination";

interface ClearQuestButtonProps {
  quest: OnboardingQuest;
  children: ReactNode;
  to?: ClearTarget;
  variant?: ButtonProps["variant"];
  colorPalette?: ButtonProps["colorPalette"];
  className?: string;
}

// 결과 단계에서 체험을 마치는 버튼. 클리어를 기록한 뒤 to로 간다.
// 저장에 실패하면 퀘스트 목록으로 돌아가고, 그 퀘스트는 도전 가능으로 남는다.
export function ClearQuestButton({
  quest,
  children,
  to = CLEAR_TARGET.list,
  variant,
  colorPalette,
  className,
}: ClearQuestButtonProps) {
  const { pending, run } = useAction();
  const router = useRouter();
  const serverPath = useServerPath();

  function clear() {
    run(() => clearQuestAction(quest), {
      onSuccess: (result) => {
        const badgeGranted = Boolean(result.badgeGranted);
        router.push(serverPath(clearedDestination({ quest, to, badgeGranted })));
      },
      onError: (result) => {
        toastActionError(result);
        router.push(serverPath(QUEST_LIST_PATH));
      },
    });
  }

  return (
    <Button
      variant={variant}
      colorPalette={colorPalette}
      size="lg"
      className={className}
      loading={pending}
      onClick={clear}
    >
      {children}
    </Button>
  );
}
