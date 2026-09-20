"use client";

import { Button } from "@trpg/ui";

export function WizardSavingButton() {
  return (
    <Button type="submit" loading size="lg" className="h-[50px]">
      저장 중…
    </Button>
  );
}
