"use client";

import { Button } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { useServerPath } from "@/shared/lib";
import { useAction } from "@/shared/ui";

import { finishOnboardingAction } from "../api/finish-onboarding-action";

export function FinishOnboardingButton() {
  const { pending, run } = useAction();
  const router = useRouter();
  const toServerPath = useServerPath();

  function finish() {
    run(finishOnboardingAction, { onSuccess: () => router.push(toServerPath("/games")) });
  }

  return (
    <Button size="lg" className="w-full" loading={pending} onClick={finish}>
      온보딩 마치기
    </Button>
  );
}
