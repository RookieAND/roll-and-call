import { Button, HStack, Table, Text } from "@roll-and-call/ui";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import type { QuizQuestion } from "@/shared/server";
import { EMPTY_IMAGE, Panel, TableColumns, TableEmptyRow, Tag } from "@/shared/ui";

interface QuizQuestionPanelProps {
  questions: QuizQuestion[];
}

export function QuizQuestionPanel({ questions }: QuizQuestionPanelProps) {
  const activeCount = questions.filter((question) => question.active).length;
  return (
    <Panel
      title="본문 퀴즈"
      right={
        <>
          <Tag>{`사용 중 ${activeCount}개`}</Tag>
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            render={<Link href="?tab=quiz&question=new" scroll={false} />}
            className="gap-050"
          >
            <Plus size={14} aria-hidden />
            문항 추가
          </Button>
        </>
      }
    >
      <Text
        typography="body4"
        foreground="hint"
        render={<p />}
        className="border-b border-(--rc-color-border-subtle) px-175 py-125"
      >
        사용 중인 문항 1개를 무작위로 출제하며, 답이 틀리면 제출할 수 없습니다.
      </Text>
      <Table.Root className="table-equal">
        <TableColumns widths={[320, 200, 80, 64, 80, { fixed: 44 }]} />
        <Table.Header>
          <Table.Row>
            <Table.Head>질문</Table.Head>
            <Table.Head>허용하는 답</Table.Head>
            <Table.Head align="end">참고 쪽수</Table.Head>
            <Table.Head align="end">출제</Table.Head>
            <Table.Head align="center">상태</Table.Head>
            <Table.Head />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {questions.length === 0 ? (
            <TableEmptyRow
              colSpan={6}
              image={EMPTY_IMAGE.myGames}
              title="등록된 문항이 없습니다"
              description="문항이 없으면 신청할 때 퀴즈 단계를 건너뜁니다."
            />
          ) : null}
          {questions.map((question) => (
            <Table.Row
              key={question.id}
              interactive
              className={question.active ? "relative" : "relative opacity-50"}
            >
              <Table.Cell>
                <Text
                  typography="body3"
                  truncate
                  render={<Link href={`?tab=quiz&question=${question.id}`} scroll={false} />}
                  className="block after:absolute after:inset-0"
                >
                  {question.question}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <HStack gap="050" className="min-w-0 overflow-hidden">
                  {question.answers.map((answer) => (
                    <Tag key={answer}>{answer}</Tag>
                  ))}
                </HStack>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {question.page || (
                  <Text typography="body3" foreground="hint">
                    —
                  </Text>
                )}
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {question.askedCount}회
              </Table.Cell>
              <Table.Cell align="center">
                <Tag>{question.active ? "사용 중" : "비활성"}</Tag>
              </Table.Cell>
              <Table.Cell align="end">
                <ChevronRight size={16} aria-hidden className="inline text-hint" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Panel>
  );
}
