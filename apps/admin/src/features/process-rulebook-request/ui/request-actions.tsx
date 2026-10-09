"use client";

import { Button, HStack } from "@roll-and-call/ui";

import { MoreMenu, ServerLink } from "@/shared/ui";

import { REQUEST_ACTION, type RequestAction } from "../model/request-action";

const ACTION_LABEL = {
  [REQUEST_ACTION.add]: "룰북 추가 심사하기",
  [REQUEST_ACTION.link]: "기존 룰북에 연결",
  [REQUEST_ACTION.reject]: "요청 반려",
} as const;

interface RequestActionsProps {
  label: string;
  similar: boolean;
  actionHrefs: Record<RequestAction, string>;
}

// 비슷한 룰북이 있으면 [기존 룰북에 연결], 없으면 [룰북 추가 심사하기]가 주 버튼이고 나머지는 ⋯ 메뉴다(D291).
export function RequestActions({ label, similar, actionHrefs }: RequestActionsProps) {
  const primary = similar ? REQUEST_ACTION.link : REQUEST_ACTION.add;
  const others = Object.values(REQUEST_ACTION).filter((action) => action !== primary);
  return (
    <HStack align="center" justify="end" gap="075">
      <Button
        variant="outline"
        colorPalette="gray"
        size="sm"
        className="min-w-[136px]"
        render={<ServerLink path={actionHrefs[primary]} scroll={false} />}
      >
        {ACTION_LABEL[primary]}
      </Button>
      <MoreMenu
        label={`${label} 다른 처리`}
        items={others.map((action) => ({
          label: ACTION_LABEL[action],
          href: actionHrefs[action],
          scroll: false,
          danger: action === REQUEST_ACTION.reject,
        }))}
      />
    </HStack>
  );
}
