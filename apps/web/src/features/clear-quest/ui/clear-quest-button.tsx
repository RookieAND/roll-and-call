"use client";

import type { OnboardingQuest } from "@roll-and-call/database/onboarding/model";
import { Button, type ButtonProps } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { useServerPath } from "@/shared/lib";
import { toast, useAction } from "@/shared/ui";

import { clearQuestAction } from "../api/clear-quest-action";

interface ClearQuestButtonProps {
  quest: OnboardingQuest;
  children: ReactNode;
  variant?: ButtonProps["variant"];
  className?: string;
}

// 결과 단계의 [다음]. 저장에 실패해도 퀘스트 목록으로 돌아가고, 그 퀘스트는 도전 가능으로 남는다.
export function ClearQuestButton({ quest, children, variant, className }: ClearQuestButtonProps) {
  const { pending, run } = useAction();
  const router = useRouter();
  const serverPath = useServerPath();
  const listPath = serverPath("/onboarding");

  function clear() {
    run(() => clearQuestAction(quest), {
      onSuccess: (result) => {
        const params = new URLSearchParams({ cleared: quest });
        if (result.badgeGranted) params.set("achievement", "1");
        router.push(`${listPath}?${params}`);
      },
      onError: ({ error }) => {
        toast.danger(error);
        router.push(listPath);
      },
    });
  }

  return (
    <Button variant={variant} size="lg" className={className} loading={pending} onClick={clear}>
      {children}
    </Button>
  );
}
