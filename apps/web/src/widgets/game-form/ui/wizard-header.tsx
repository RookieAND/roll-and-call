"use client";

import { Text } from "@trpg/ui";
import { AppBar } from "@/shared/ui";

export const WIZARD_STEPS = [1, 2, 3] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];
export const LAST_WIZARD_STEP = WIZARD_STEPS.length as WizardStep;

// 앱바 제목은 무엇을 만드는지("구인 등록") 하나. 단계는 오른쪽 "n / 3" 숫자와 3px 진행바로만 말한다.
// 첫 단계의 왼쪽 버튼은 작업을 그만두는 ✕, 그 뒤로는 이전 단계로 가는 ‹.
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
        <div className="h-full bg-primary-600 transition-[width]" style={{ width: `${percent}%` }} />
      </div>
    </>
  );
}
