import { Button, HStack, VStack } from "@roll-and-call/ui";

import type { HomebrewRuleInfo } from "@/entities/homebrew/server";
import type { RulebookDetail } from "@/entities/rulebook/server";
import { HomebrewScopeCard } from "@/features/change-homebrew-scope";
import { RulebookEditForm } from "@/features/write-rulebook";
import type { TableSort } from "@/shared/lib";
import { AdminHeader, RouteTabs, TabCount, ServerLink, Tag } from "@/shared/ui";

import type { CertifiedGmSortColumn } from "../model/certified-gm-sort";
import { RULEBOOK_DETAIL_TAB, type RulebookDetailTab } from "../model/rulebook-detail-tab";
import { CategoryCard } from "./category-card";
import { CertifiedGmPanel } from "./certified-gm-panel";
import { HomebrewInfoPanel } from "./homebrew-info-panel";
import { QuizDialogSlot } from "./quiz-dialog-slot";
import { QuizQuestionPanel } from "./quiz-question-panel";

interface RulebookDetailViewProps {
  rulebook: RulebookDetail;
  homebrew: HomebrewRuleInfo | null;
  tab: RulebookDetailTab;
  gmSort: TableSort<CertifiedGmSortColumn>;
  viewerId: string;
  page?: string;
  pageSize?: string;
}

export function RulebookDetailView({
  rulebook,
  homebrew,
  tab,
  gmSort,
  viewerId,
  page,
  pageSize,
}: RulebookDetailViewProps) {
  const logHref = `/log?target=${encodeURIComponent(rulebook.name)}`;
  const basePath = `/rules/${rulebook.id}`;
  const activeQuizCount = rulebook.quizQuestions.filter((question) => question.active).length;
  const tabLabel = (label: string, count: number, value: RulebookDetailTab) => (
    <HStack align="center" gap="075" render={<span />}>
      {label}
      <TabCount count={count} selected={tab === value} />
    </HStack>
  );
  // 자작 룰은 인증 개념이 없어 본문 퀴즈·인증 현황 탭을 숨긴다.
  const tabs = [
    { label: "기본 정보", href: basePath },
    ...(rulebook.certRequired && !homebrew
      ? [
          {
            label: tabLabel("본문 퀴즈", activeQuizCount, RULEBOOK_DETAIL_TAB.quiz),
            href: `${basePath}?tab=${RULEBOOK_DETAIL_TAB.quiz}`,
          },
        ]
      : []),
    ...(homebrew
      ? []
      : [
          {
            label: tabLabel("인증 현황", rulebook.certifiedGms.length, RULEBOOK_DETAIL_TAB.gms),
            href: `${basePath}?tab=${RULEBOOK_DETAIL_TAB.gms}`,
          },
        ]),
  ];
  const tabHref = tab === RULEBOOK_DETAIL_TAB.info ? basePath : `${basePath}?tab=${tab}`;

  return (
    <>
      <AdminHeader
        title={
          <HStack align="center" gap="100" render={<span />}>
            {rulebook.label}
            {rulebook.hidden ? <Tag>숨김</Tag> : null}
          </HStack>
        }
        trail={[{ href: "/rules", label: "룰북" }]}
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
          lead={homebrew ? <HomebrewInfoPanel ruleLabel={rulebook.label} info={homebrew} /> : null}
          aside={
            <VStack gap="200">
              {homebrew ? (
                <HomebrewScopeCard
                  key={homebrew.scope}
                  rulebookId={rulebook.id}
                  scope={homebrew.scope}
                  hidden={rulebook.hidden}
                  viewerId={viewerId}
                />
              ) : null}
              <CategoryCard rulebook={rulebook} />
            </VStack>
          }
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
              pageSize={pageSize}
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
