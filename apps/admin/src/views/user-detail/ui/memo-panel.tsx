import { Badge, Button, VStack } from "@roll-and-call/ui";
import { Quote } from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { EMPTY_IMAGE, EmptyState, ItemCard, Panel } from "@/shared/ui";

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
      bodyClassName={memos.length ? "p-150" : undefined}
    >
      {memos.length ? (
        <VStack gap="100">
          {memos.map((memo) => (
            <ItemCard
              key={memo.id}
              icon={Quote}
              title={memo.author}
              meta={formatDate(memo.at)}
              tags={<Badge colorPalette="gray">사용자에게 안 보이는 메모</Badge>}
            >
              {memo.body}
            </ItemCard>
          ))}
        </VStack>
      ) : (
        <EmptyState
          image={EMPTY_IMAGE.hosted}
          title="운영진 메모가 없습니다"
          description="메모는 사용자에게 보이지 않습니다. 제재나 경고를 하기 전에 확인한 내용을 남겨 두면 다른 운영진이 함께 볼 수 있습니다."
        />
      )}
    </Panel>
  );
}
