import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { formatDate, withTopicParticle } from "@/shared/lib";
import type { Sanction } from "@/shared/server";
import { ConflictNotice } from "@/shared/ui";

interface SanctionConflictProps {
  nickname: string;
  conflict: Sanction;
}

export function SanctionConflict({ nickname, conflict }: SanctionConflictProps) {
  const period = conflict.until ? `${formatDate(conflict.until)}까지` : "무기한";
  return (
    <ConflictNotice
      title={`다른 운영진(${conflict.by})이 방금 제재를 확정했습니다`}
      description={`${withTopicParticle(nickname)} ${period} 제재 중입니다. 입력한 내용은 저장되지 않았습니다.`}
      actions={
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          render={<Link href={`/log?target=${encodeURIComponent(nickname)}`} />}
        >
          활동 기록에서 보기
        </Button>
      }
    />
  );
}
