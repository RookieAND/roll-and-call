"use client";

import { Button, IconButton, Popover, VStack } from "@roll-and-call/ui";
import { Ellipsis, Flag } from "lucide-react";
import { useState } from "react";

import { withQuery } from "@/shared/lib";
import { ServerLink } from "@/shared/ui";

interface NoShowRowMenuProps {
  recordId: string;
}

export function NoShowRowMenu({ recordId }: NoShowRowMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger render={<IconButton variant="outline" size="sm" aria-label="더 보기" />}>
        <Ellipsis size={16} aria-hidden />
      </Popover.Trigger>
      <Popover.Popup align="end" className="w-[160px] p-075">
        <VStack>
          <Button
            variant="ghost"
            colorPalette="gray"
            size="sm"
            render={<ServerLink path={withQuery("/noshow", {}, { record: recordId })} />}
            onClick={() => setOpen(false)}
            className="justify-start gap-100"
          >
            <Flag size={16} aria-hidden />
            기록 열기
          </Button>
        </VStack>
      </Popover.Popup>
    </Popover.Root>
  );
}
