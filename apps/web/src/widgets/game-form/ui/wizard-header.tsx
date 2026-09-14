"use client";

import { cn, Text } from "@trpg/ui";
import { AppBar } from "@/shared/ui";

export const WIZARD_STEPS = [1, 2, 3] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];
export const LAST_WIZARD_STEP = WIZARD_STEPS.length as WizardStep;

// 단계에 따라 제목·뒤로가기·진행바가 함께 바뀐다.
export function WizardHeader({
  step,
  title,
  backHref,
  onBack,
}: {
  step: WizardStep;
  title: string;
  // 1단계에서는 화면을 떠나고, 그 뒤로는 이전 단계로 돌아간다.
  backHref?: string;
  onBack?: () => void;
}) {
  return (
    <>
      <AppBar
        title={title}
        back={backHref}
        onBack={onBack}
        action={
          <Text typography="code2" foreground="hint" className="tabular-nums">
            {step} / {LAST_WIZARD_STEP}
          </Text>
        }
      />
      <div className="flex gap-1.5 px-4 pt-2.5">
        {WIZARD_STEPS.map((s) => (
          <span
            key={s}
            className={cn("h-1 flex-1 rounded-full", s <= step ? "bg-primary-600" : "bg-gray-200")}
          />
        ))}
      </div>
    </>
  );
}
