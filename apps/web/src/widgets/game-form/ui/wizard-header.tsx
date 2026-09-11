"use client";

import { cn, Text } from "@trpg/ui";
import { AppBar } from "@/shared/ui";

// 단계에 따라 제목·뒤로가기·진행바가 함께 바뀐다.
export function WizardHeader({
  step,
  title,
  backHref,
  onBack,
}: {
  step: 1 | 2;
  title: string;
  // 1단계에서는 화면을 떠나고, 2단계에서는 이전 단계로 돌아간다.
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
            {step} / 2
          </Text>
        }
      />
      <div className="flex gap-1.5 px-4 pt-2.5">
        <span className="h-1 flex-1 rounded-full bg-primary-600" />
        <span
          className={cn("h-1 flex-1 rounded-full", step === 2 ? "bg-primary-600" : "bg-[#EAEAF0]")}
        />
      </div>
    </>
  );
}
