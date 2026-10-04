"use client";

import { Button, IconButton, Popover, Tooltip, VStack } from "@roll-and-call/ui";
import { Ellipsis, RotateCcw, ScrollText, Search } from "lucide-react";
import { useState } from "react";

import { ServerLink } from "@/shared/ui";

import { CERT_ROW_ACTION, type CertRowActionLink } from "../model/cert-row-action";

const ACTION_VIEW = {
  [CERT_ROW_ACTION.revoke]: { label: "반려로 돌리기", Icon: RotateCcw, danger: true },
  [CERT_ROW_ACTION.review]: { label: "심사 상세 열기", Icon: Search, danger: false },
  [CERT_ROW_ACTION.log]: { label: "활동 기록에서 보기", Icon: ScrollText, danger: false },
} as const;

interface CertRowMenuProps {
  label: string;
  actions: CertRowActionLink[];
}

// 동작이 하나뿐이면(반려됨) 메뉴 대신 아이콘 버튼 + 툴팁이다(D293).
export function CertRowMenu({ label, actions }: CertRowMenuProps) {
  const [open, setOpen] = useState(false);
  const [only] = actions;
  if (actions.length === 1 && only) {
    const { label: actionLabel, Icon } = ACTION_VIEW[only.action];
    return (
      <Tooltip content={actionLabel}>
        <IconButton
          variant="outline"
          size="sm"
          aria-label={`${label} ${actionLabel}`}
          render={<ServerLink path={only.href} />}
        >
          <Icon size={16} aria-hidden />
        </IconButton>
      </Tooltip>
    );
  }
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        render={<IconButton variant="outline" size="sm" aria-label={`${label} 더 보기`} />}
      >
        <Ellipsis size={16} aria-hidden />
      </Popover.Trigger>
      <Popover.Popup align="end" className="w-[190px] p-075">
        <VStack>
          {actions.map(({ action, href }) => {
            const { label: actionLabel, Icon, danger } = ACTION_VIEW[action];
            return (
              <Button
                key={action}
                variant="ghost"
                colorPalette={danger ? "danger" : "gray"}
                size="sm"
                render={<ServerLink path={href} scroll={false} />}
                onClick={() => setOpen(false)}
                className="justify-start gap-100"
              >
                <Icon size={16} aria-hidden />
                {actionLabel}
              </Button>
            );
          })}
        </VStack>
      </Popover.Popup>
    </Popover.Root>
  );
}
