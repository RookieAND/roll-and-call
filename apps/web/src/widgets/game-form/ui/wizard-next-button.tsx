"use client";

import { Button } from "@roll-and-call/ui";

interface WizardNextButtonProps {
  onClick: () => void;
}

export function WizardNextButton({ onClick }: WizardNextButtonProps) {
  return (
    <Button type="button" onClick={onClick} size="lg">
      다음
    </Button>
  );
}
