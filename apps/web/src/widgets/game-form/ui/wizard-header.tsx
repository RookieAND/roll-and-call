"use client";

import { Text } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

export function WizardHeader({
  step,
  total,
  title,
  onBack,
}: {
  step: number;
  total: number;
  title: string;
  onBack: () => void;
}) {
  return (
    <>
      <AppBar
        title={title}
        onBack={onBack}
        backIcon={step === 1 ? "close" : "back"}
        action={
          <Text numeric typography="subtitle2" foreground="muted">
            {step} / {total}
          </Text>
        }
      />
      <div
        role="progressbar"
        aria-label={`${title} 진행`}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        className="h-[3px] bg-gray-100"
      >
        <div
          className="h-full bg-primary-600 transition-[width]"
          style={{ width: `${Math.round((step / total) * 100)}%` }}
        />
      </div>
    </>
  );
}
