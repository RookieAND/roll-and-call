import { Button, HStack, VStack } from "@roll-and-call/ui";

import { RulebookEditForm } from "@/features/write-rulebook";
import type { TableSort } from "@/shared/lib";
import type { RulebookDetail } from "@/shared/server";
import { AdminHeader, RouteTabs, TabCount, ServerLink } from "@/shared/ui";

import type { CertifiedGmSortColumn } from "../model/certified-gm-sort";
import { RULEBOOK_DETAIL_TAB, type RulebookDetailTab } from "../model/rulebook-detail-tab";
import { CategoryCard } from "./category-card";
import { CertifiedGmPanel } from "./certified-gm-panel";
import { QuizDialogSlot } from "./quiz-dialog-slot";
import { QuizQuestionPanel } from "./quiz-question-panel";

interface RulebookDetailViewProps {
  rulebook: RulebookDetail;
  tab: RulebookDetailTab;
  gmSort: TableSort<CertifiedGmSortColumn>;
  viewerId: string;
  page?: string;
}

export function RulebookDetailView({
  rulebook,
  tab,
  gmSort,
  viewerId,
  page,
}: RulebookDetailViewProps) {
  const logHref = `/log?target=${encodeURIComponent(rulebook.name)}`;
  const sub = `${rulebook.hidden ? "숨김 · " : ""}룰북 상세 · ${rulebook.category}`;
  const basePath = `/rules/${rulebook.id}`;
  const activeQuizCount = rulebook.quizQuestions.filter((question) => question.active).length;
  const tabLabel = (label: string, count: number, value: RulebookDetailTab) => (
    <HStack align="center" gap="075" render={<span />}>
      {label}
      <TabCount count={count} selected={tab === value} />
    </HStack>
  );
  const tabs = [
    { label: "기본 정보", href: basePath },
    ...(rulebook.certRequired
      ? [
          {
            label: tabLabel("본문 퀴즈", activeQuizCount, RULEBOOK_DETAIL_TAB.quiz),
            href: `${basePath}?tab=${RULEBOOK_DETAIL_TAB.quiz}`,
          },
        ]
      : []),
    {
      label: tabLabel("인증 현황", rulebook.certifiedGms.length, RULEBOOK_DETAIL_TAB.gms),
      href: `${basePath}?tab=${RULEBOOK_DETAIL_TAB.gms}`,
    },
  ];
  const tabHref = tab === RULEBOOK_DETAIL_TAB.info ? basePath : `${basePath}?tab=${tab}`;

  return (
    <>
      <AdminHeader
        title={rulebook.label}
        trail={[{ href: "/rules", label: "룰북" }]}
        sub={sub}
        actions={
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            render={<ServerLink path={logHref} />}
          >
            활동 기록에서 보기
          </Button>
        }
      />
      <RouteTabs label="룰북 상세 화면" items={tabs} value={tabHref} />
      {tab === RULEBOOK_DETAIL_TAB.info ? (
        <RulebookEditForm
          key={rulebook.label}
          rulebook={rulebook}
          viewerId={viewerId}
          aside={<CategoryCard rulebook={rulebook} />}
        />
      ) : (
        <VStack gap="200" className="flex-1 p-200">
          {tab === RULEBOOK_DETAIL_TAB.quiz ? (
            <QuizQuestionPanel questions={rulebook.quizQuestions} />
          ) : (
            <CertifiedGmPanel
              rulebookId={rulebook.id}
              kind={rulebook.kind}
              gms={rulebook.certifiedGms}
              certRequired={rulebook.certRequired}
              sort={gmSort}
              page={page}
            />
          )}
        </VStack>
      )}
      {tab === RULEBOOK_DETAIL_TAB.quiz ? (
        <QuizDialogSlot rulebookId={rulebook.id} questions={rulebook.quizQuestions} />
      ) : null}
    </>
  );
}
