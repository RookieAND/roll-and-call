import { Button, HStack, Text, VStack } from "@roll-and-call/ui";

import type { UserDetail } from "@/entities/user/server";
import { formatDateTime } from "@/shared/lib";
import { EMPTY_IMAGE, EmptyState, ServerLink } from "@/shared/ui";

import { USER_ACTION } from "../../model/user-action";
import { userActionHref } from "../../model/user-action-href";
import { USER_DETAIL_TAB } from "../../model/user-detail-tab";
import type { Viewer } from "../../model/viewer";
import { MemoRowSheet } from "./memo-row-sheet";

interface MemoListProps {
  userId: string;
  nickname: string;
  memos: UserDetail["memos"];
  viewer: Viewer;
}

export function MemoList({ userId, nickname, memos, viewer }: MemoListProps) {
  const canManage = (memo: UserDetail["memos"][number]) =>
    memo.direct && (viewer.owner || memo.authorId === viewer.id);
  return (
    <>
      <VStack
        gap="075"
        className="border-b border-(--rc-color-border-subtle) bg-surface px-200 py-150"
      >
        <Button
          size="lg"
          render={
            <ServerLink
              path={userActionHref(userId, { tab: USER_DETAIL_TAB.memo, action: USER_ACTION.memo })}
              scroll={false}
            />
          }
        >
          메모 추가
        </Button>
        {memos.length ? (
          <Text typography="body4" foreground="hint">
            사용자에게 보이지 않는 메모입니다.
          </Text>
        ) : null}
      </VStack>
      {memos.length ? (
        <VStack render={<ul />}>
          {memos.map((memo) => (
            <HStack
              key={memo.id}
              render={<li />}
              align="start"
              gap="050"
              className="border-b border-(--rc-color-border-subtle) bg-surface py-150 pr-100 pl-200"
            >
              <VStack gap="050" className="min-w-0 flex-1">
                <Text typography="body4" foreground="hint">
                  {`${formatDateTime(memo.at)} · ${memo.author}${memo.tag ? ` · ${memo.tag}` : ""}`}
                </Text>
                <Text
                  typography="body3"
                  className="leading-[1.7] break-keep whitespace-pre-line [overflow-wrap:anywhere]"
                >
                  {memo.body}
                </Text>
              </VStack>
              {canManage(memo) ? (
                <MemoRowSheet
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
    </>
  );
}
