import { Button, Field, Textarea, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { formatMonthDay, withTopicParticle } from "@/shared/lib";
import type { Sanction } from "@/shared/server";
import { ConflictNotice } from "@/shared/ui";

interface SanctionConflictProps {
  nickname: string;
  conflict: Sanction;
  userReason: string;
  staffMemo: string;
}

export function SanctionConflict({
  nickname,
  conflict,
  userReason,
  staffMemo,
}: SanctionConflictProps) {
  const period = conflict.until ? `${formatMonthDay(conflict.until)}까지` : "무기한";

  return (
    <VStack gap="150">
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
      <VStack gap="150" aria-hidden className="pointer-events-none opacity-50">
        <Field.Root label="사용자에게 보여줄 사유" htmlFor="sanction-conflict-reason">
          <Textarea
            id="sanction-conflict-reason"
            rows={2}
            value={userReason}
            readOnly
            tabIndex={-1}
          />
        </Field.Root>
        <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="sanction-conflict-memo">
          <Textarea id="sanction-conflict-memo" rows={2} value={staffMemo} readOnly tabIndex={-1} />
        </Field.Root>
      </VStack>
    </VStack>
  );
}
