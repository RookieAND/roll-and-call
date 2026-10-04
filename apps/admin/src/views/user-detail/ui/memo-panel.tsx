import { Button, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { EMPTY_IMAGE, EmptyState, Panel, ServerLink, Tag } from "@/shared/ui";

import { USER_ACTION } from "../model/user-action";
import { userActionHref } from "../model/user-action-href";
import { USER_DETAIL_TAB } from "../model/user-detail-tab";
import type { Viewer } from "../model/viewer";
import { MemoRowMenu } from "./memo-row-menu";

interface MemoPanelProps {
  userId: string;
  nickname: string;
  memos: UserDetail["memos"];
  viewer: Viewer;
}

export function MemoPanel({ userId, nickname, memos, viewer }: MemoPanelProps) {
  const canManage = (memo: UserDetail["memos"][number]) =>
    memo.direct && (viewer.owner || memo.authorId === viewer.id);
  return (
    <Panel
      description={memos.length ? "사용자에게 보이지 않는 메모입니다." : undefined}
      right={
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          render={
            <ServerLink
              path={userActionHref(userId, { tab: USER_DETAIL_TAB.memo, action: USER_ACTION.memo })}
              scroll={false}
            />
          }
        >
          메모 추가
        </Button>
      }
    >
      {memos.length ? (
        <VStack render={<ul />} className="divide-y divide-(--rc-color-border-subtle)">
          {memos.map((memo) => (
            <HStack key={memo.id} render={<li />} align="start" gap="150" className="px-175 py-150">
              <VStack gap="075" className="min-w-0 flex-1">
                <HStack align="center" gap="100">
                  <Text typography="body3" weight="bold">
                    {memo.author}
                  </Text>
                  <Text typography="body4" foreground="hint">
                    {formatDateTime(memo.at)}
                  </Text>
                  {memo.tag ? <Tag>{memo.tag}</Tag> : null}
                </HStack>
                <Text typography="body3" className="whitespace-pre-line">
                  {memo.body}
                </Text>
              </VStack>
              {canManage(memo) ? (
                <MemoRowMenu
                  userId={userId}
                  nickname={nickname}
                  memo={{ id: memo.id, body: memo.body }}
                />
              ) : null}
            </HStack>
          ))}
        </VStack>
      ) : (
        <EmptyState
          image={EMPTY_IMAGE.hosted}
          title="운영진 메모가 없습니다"
          description="운영진이 메모를 추가하면 이곳에 표시됩니다. 메모는 사용자에게 보이지 않습니다."
        />
      )}
    </Panel>
  );
}
