import { Button, HStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import Link from "next/link";

import { REQUEST_ACTION, type RequestAction } from "../model/request-action";

interface RequestActionsProps {
  actionHref: (action: RequestAction) => string;
}

// 세 처리 모두 주소의 action으로 창을 연다.
export function RequestActions({ actionHref }: RequestActionsProps) {
  return (
    <HStack align="center" gap="075">
      <Button
        size="sm"
        render={<Link href={actionHref(REQUEST_ACTION.add)} scroll={false} />}
        className="gap-050"
      >
        <Plus size={14} aria-hidden />새 룰북으로 추가
      </Button>
      <Button
        variant="outline"
        colorPalette="gray"
        size="sm"
        render={<Link href={actionHref(REQUEST_ACTION.link)} scroll={false} />}
      >
        기존 룰북에 연결
      </Button>
      <Button
        variant="outline"
        colorPalette="danger"
        size="sm"
        render={<Link href={actionHref(REQUEST_ACTION.reject)} scroll={false} />}
      >
        반려
      </Button>
    </HStack>
  );
}
