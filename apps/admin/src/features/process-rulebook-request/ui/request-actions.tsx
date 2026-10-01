"use client";

import { Button, HStack, IconButton, Popover, VStack } from "@roll-and-call/ui";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { REQUEST_ACTION, type RequestAction } from "../model/request-action";

const ACTION_LABEL = {
  [REQUEST_ACTION.add]: "새 룰북으로 추가",
  [REQUEST_ACTION.link]: "기존 룰북에 연결",
  [REQUEST_ACTION.reject]: "반려",
} as const;

interface RequestActionsProps {
  similar: boolean;
  actionHref: (action: RequestAction) => string;
}

export function RequestActions({ similar, actionHref }: RequestActionsProps) {
  const [open, setOpen] = useState(false);
  const primary = similar ? REQUEST_ACTION.link : REQUEST_ACTION.add;
  const others = Object.values(REQUEST_ACTION).filter((action) => action !== primary);
  return (
    <HStack align="center" justify="end" gap="075">
      <Button size="sm" render={<Link href={actionHref(primary)} scroll={false} />}>
        {ACTION_LABEL[primary]}
      </Button>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger render={<IconButton variant="outline" size="sm" aria-label="다른 처리" />}>
          <Ellipsis size={16} aria-hidden />
        </Popover.Trigger>
        <Popover.Popup align="end" className="w-[200px] p-075">
          <VStack>
            {others.map((action) => (
              <Button
                key={action}
                variant="ghost"
                colorPalette={action === REQUEST_ACTION.reject ? "danger" : "gray"}
                size="sm"
                render={<Link href={actionHref(action)} scroll={false} />}
                onClick={() => setOpen(false)}
                className="justify-start"
              >
                {ACTION_LABEL[action]}
              </Button>
            ))}
          </VStack>
        </Popover.Popup>
      </Popover.Root>
    </HStack>
  );
}
