"use client";

import { Button } from "@trpg/ui";

interface WizardNextButtonProps {
  onClick: () => void;
}

export function WizardNextButton({ onClick }: WizardNextButtonProps) {
  return (
    <Button type="button" onClick={onClick} size="lg" className="h-[50px]">
      다음
    </Button>
  );
}
