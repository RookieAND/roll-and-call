"use client";

import { Text } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

export const WIZARD_STEPS = [1, 2, 3] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];
export const LAST_WIZARD_STEP = WIZARD_STEPS.length as WizardStep;

export function WizardHeader({
  step,
  title,
  onBack,
}: {
  step: WizardStep;
  title: string;
  onBack: () => void;
}) {
  const percent = Math.round((step / LAST_WIZARD_STEP) * 100);

  return (
    <>
      <AppBar
        title={title}
        onBack={onBack}
        backIcon={step === 1 ? "close" : "back"}
        action={
          <Text typography="code2" foreground="hint" className="tabular-nums">
            {step} / {LAST_WIZARD_STEP}
          </Text>
        }
      />
      <div
        role="progressbar"
        aria-label="구인 등록 진행"
        aria-valuemin={1}
        aria-valuemax={LAST_WIZARD_STEP}
        aria-valuenow={step}
        className="h-[3px] bg-gray-100"
      >
        <div
          className="h-full bg-primary-600 transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </>
  );
}
