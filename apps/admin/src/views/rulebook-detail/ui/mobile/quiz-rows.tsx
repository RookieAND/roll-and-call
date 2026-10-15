import { Button, Text, VStack } from "@roll-and-call/ui";

import type { QuizQuestion } from "@/shared/server";
import { EMPTY_IMAGE, EmptyState, ListRow, ServerLink, Tag } from "@/shared/ui";

interface QuizRowsProps {
  rulebookId: string;
  questions: QuizQuestion[];
}

// 문항을 누르면 데스크톱과 같은 주소(?question=)로 문항 창을 연다. 모바일에서는 시트다.
export function QuizRows({ rulebookId, questions }: QuizRowsProps) {
  const basePath = `/rules/${rulebookId}?tab=quiz`;
  return (
    <>
      <VStack
        gap="075"
        className="border-b border-(--rc-color-border-subtle) bg-surface px-200 py-150"
      >
        <Button size="lg" render={<ServerLink path={`${basePath}&question=new`} scroll={false} />}>
          문항 추가
        </Button>
        <Text typography="body4" foreground="hint">
          사용 중인 문항 1개를 무작위로 출제하며, 답이 틀리면 제출할 수 없습니다.
        </Text>
      </VStack>
      {questions.length === 0 ? (
        <EmptyState
          image={EMPTY_IMAGE.myGames}
          title="등록된 문항이 없습니다"
          description="문항이 없으면 신청할 때 퀴즈 단계를 건너뜁니다."
        />
      ) : (
        questions.map((question) => (
          <ListRow
            key={question.id}
            path={`${basePath}&question=${question.id}`}
            title={question.question}
            muted={!question.active}
            badges={question.active ? null : <Tag>비활성</Tag>}
            description={question.answers.join(", ")}
            meta={`출제 ${question.askedCount}회${question.page ? ` · 참고 ${question.page}쪽` : ""}`}
          />
        ))
      )}
    </>
  );
}
