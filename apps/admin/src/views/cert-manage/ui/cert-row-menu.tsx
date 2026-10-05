"use client";

import { IconButton, Tooltip } from "@roll-and-call/ui";
import { RotateCcw, ScrollText, Search } from "lucide-react";

import { MoreMenu, ServerLink } from "@/shared/ui";

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
    <MoreMenu
      label={`${label} 더 보기`}
      widthClassName="w-[190px]"
      items={actions.map(({ action, href }) => {
        const { label: actionLabel, Icon, danger } = ACTION_VIEW[action];
        return { label: actionLabel, icon: Icon, href, scroll: false, danger };
      })}
    />
  );
}
