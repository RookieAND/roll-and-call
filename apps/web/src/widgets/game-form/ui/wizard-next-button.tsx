"use client";

import { Button } from "@trpg/ui";

export function WizardNextButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" onClick={onClick} size="lg" className="h-[50px]">
      다음
    </Button>
  );
}
