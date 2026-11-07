"use client";

import { Button, Callout } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";

interface ReviewFailCalloutProps {
  retry: () => void;
}

export function ReviewFailCallout({ retry }: ReviewFailCalloutProps) {
  return (
    <Callout.Root colorPalette="danger">
      <Callout.Icon />
      <Callout.Title>신청을 불러오지 못했습니다.</Callout.Title>
      <Callout.Description>잠시 뒤 다시 시도해 주세요.</Callout.Description>
      <Callout.Action>
        <Button variant="outline" colorPalette="gray" size="sm" onClick={retry}>
          <RotateCcw size={14} aria-hidden />
          다시 시도
        </Button>
      </Callout.Action>
    </Callout.Root>
  );
}
