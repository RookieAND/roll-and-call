"use client";

import { Button } from "@trpg/ui";

export function WizardSubmitButton({ label }: { label: string }) {
  return (
    <Button type="submit" size="lg" className="h-[50px]">
      {label}
    </Button>
  );
}
