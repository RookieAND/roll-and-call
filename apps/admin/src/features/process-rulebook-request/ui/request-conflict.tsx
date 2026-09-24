import { Dialog, Button } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";
import type { RulebookActionResult } from "@/shared/server";
import { ConflictNotice } from "@/shared/ui";

import { conflictTitle } from "../model/conflict-title";

interface RequestConflictProps {
  conflict: Extract<RulebookActionResult, { ok: false }>["conflict"];
}

export function RequestConflict({ conflict }: RequestConflictProps) {
  const description = conflict
    ? `${formatDateTime(conflict.at)}에 처리됐습니다. 입력한 내용은 저장되지 않았습니다.`
    : "입력한 내용은 저장되지 않았습니다.";
  return (
    <ConflictNotice
      title={conflictTitle(conflict)}
      description={description}
      actions={<Dialog.Close render={<Button size="sm" />}>닫기</Dialog.Close>}
    />
  );
}
