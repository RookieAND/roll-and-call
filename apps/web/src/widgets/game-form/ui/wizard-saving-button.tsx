"use client";

import { Button } from "@roll-and-call/ui";

interface WizardSavingButtonProps {
  label: string;
}

export function WizardSavingButton({ label }: WizardSavingButtonProps) {
  return (
    <Button type="submit" loading size="lg">
      {label}
    </Button>
  );
}
