"use client";

import { Button } from "@trpg/ui";

interface WizardSubmitButtonProps {
  label: string;
}

export function WizardSubmitButton({ label }: WizardSubmitButtonProps) {
  return (
    <Button type="submit" size="lg" className="h-[50px]">
      {label}
    </Button>
  );
}
