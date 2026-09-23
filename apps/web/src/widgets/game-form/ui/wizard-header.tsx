"use client";

import { Progress, Text } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

interface WizardHeaderProps {
  step: number;
  total: number;
  title: string;
  onBack: () => void;
}

export function WizardHeader({ step, total, title, onBack }: WizardHeaderProps) {
  return (
    <>
      <AppBar
        title={title}
        onBack={onBack}
        backIcon={step === 1 ? "close" : "back"}
        action={
          <Text numeric typography="body4" foreground="hint" className="mr-050">
            {step} / {total}
          </Text>
        }
      />
      <Progress
        value={step}
        max={total}
        colorPalette="primary"
        aria-label={`${title} 진행`}
        className="h-[3px] rounded-none"
      />
    </>
  );
}
