import { Badge, Button, VStack } from "@roll-and-call/ui";
import { Quote } from "lucide-react";
import Link from "next/link";

import type { UserDetail } from "@/shared/server";
import { EmptyState, ItemCard, Panel } from "@/shared/ui";

import { formatMemoDate } from "../model/format-memo-date";
import { USER_ACTION } from "../model/user-action";
import { userActionHref } from "../model/user-action-href";
import { USER_DETAIL_TAB } from "../model/user-detail-tab";

interface MemoPanelProps {
  userId: string;
  memos: UserDetail["memos"];
}

export function MemoPanel({ userId, memos }: MemoPanelProps) {
  return (
    <Panel
      title="운영진 메모"
      right={
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          render={
            <Link
              href={userActionHref(userId, { tab: USER_DETAIL_TAB.memo, action: USER_ACTION.memo })}
              scroll={false}
            />
          }
        >
          메모 추가
        </Button>
      }
      bodyClassName="p-150"
    >
      {memos.length ? (
        <VStack gap="100">
          {memos.map((memo) => (
            <ItemCard
              key={memo.id}
              icon={Quote}
              title={memo.author}
              meta={formatMemoDate(memo.at)}
              tags={<Badge colorPalette="gray">사용자에게 안 보이는 메모</Badge>}
            >
              {memo.body}
            </ItemCard>
          ))}
        </VStack>
      ) : (
        <EmptyState title="아직 메모가 없어요" />
      )}
    </Panel>
  );
}
