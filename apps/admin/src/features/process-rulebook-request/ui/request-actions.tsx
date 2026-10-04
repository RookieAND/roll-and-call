"use client";

import { Button, HStack, IconButton, Popover, VStack } from "@roll-and-call/ui";
import { Ellipsis } from "lucide-react";
import { useState } from "react";

import { ServerLink } from "@/shared/ui";

import { REQUEST_ACTION, type RequestAction } from "../model/request-action";

const ACTION_LABEL = {
  [REQUEST_ACTION.add]: "새 룰북으로 추가",
  [REQUEST_ACTION.link]: "기존 룰북에 연결",
  [REQUEST_ACTION.reject]: "요청 반려",
} as const;

interface RequestActionsProps {
  label: string;
  similar: boolean;
  actionHref: (action: RequestAction) => string;
}

// 비슷한 룰북이 있으면 [기존 룰북에 연결], 없으면 [새 룰북으로 추가]가 주 버튼이고 나머지는 ⋯ 메뉴다(D291).
export function RequestActions({ label, similar, actionHref }: RequestActionsProps) {
  const [open, setOpen] = useState(false);
  const primary = similar ? REQUEST_ACTION.link : REQUEST_ACTION.add;
  const others = Object.values(REQUEST_ACTION).filter((action) => action !== primary);
  return (
    <HStack align="center" justify="end" gap="075">
      <Button
        variant="outline"
        colorPalette="gray"
        size="sm"
        render={<ServerLink path={actionHref(primary)} scroll={false} />}
      >
        {ACTION_LABEL[primary]}
      </Button>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          render={<IconButton variant="outline" size="sm" aria-label={`${label} 다른 처리`} />}
        >
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
                render={<ServerLink path={actionHref(action)} scroll={false} />}
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
