import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { formatDateTime } from "@/shared/lib";
import type { ReviewModerationResult } from "@/shared/server";
import { ConflictNotice } from "@/shared/ui";

import { CONFLICT_VERB } from "../model/action-copy";

interface ReviewFailureNoticeProps {
  failure: Extract<ReviewModerationResult, { ok: false }>;
}

export function ReviewFailureNotice({ failure }: ReviewFailureNoticeProps) {
  const conflict = failure.gone ? null : failure.conflict;
  const title = conflict
    ? `다른 운영진(${conflict.by})이 먼저 ${CONFLICT_VERB[conflict.action] ?? "처리"}했습니다`
    : "후기를 찾을 수 없습니다";
  const description = conflict
    ? `${formatDateTime(conflict.at)}에 처리되어 더 조치할 수 없습니다.`
    : "작성자가 삭제한 후기입니다. 걸린 신고는 자동으로 닫혔습니다.";
  const actionLabel = failure.gone ? "다음 신고" : "목록 새로고침";
  return (
    <ConflictNotice
      title={title}
      description={description}
      actions={
        <Button size="sm" render={<Link href="/posts/reviews" />}>
          {actionLabel}
        </Button>
      }
    />
  );
}
