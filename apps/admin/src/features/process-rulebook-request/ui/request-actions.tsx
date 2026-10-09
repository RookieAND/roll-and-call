"use client";

import { HStack } from "@roll-and-call/ui";

import { MoreMenu } from "@/shared/ui";

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

// 비슷한 룰북이 있으면 [기존 룰북에 연결], 없으면 [룰북 추가 심사하기]를 메뉴 맨 위에 둔다.
export function RequestActions({ label, similar, actionHrefs }: RequestActionsProps) {
  const primary = similar ? REQUEST_ACTION.link : REQUEST_ACTION.add;
  const actions = [
    primary,
    ...Object.values(REQUEST_ACTION).filter((action) => action !== primary),
  ];
  return (
    <HStack align="center" justify="end">
      <MoreMenu
        label={`${label} 처리`}
        items={actions.map((action) => ({
          label: ACTION_LABEL[action],
          href: actionHrefs[action],
          scroll: false,
          danger: action === REQUEST_ACTION.reject,
        }))}
      />
    </HStack>
  );
}
