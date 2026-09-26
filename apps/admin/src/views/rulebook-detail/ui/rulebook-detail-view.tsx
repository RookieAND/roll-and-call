import { Button, HStack, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { RulebookEditForm } from "@/features/write-rulebook";
import type { GrantCandidate, RulebookDetail } from "@/shared/server";
import { AdminHeader, RouteTabs, TabCount } from "@/shared/ui";

import { RULEBOOK_DETAIL_TAB, type RulebookDetailTab } from "../model/rulebook-detail-tab";
import { CategoryCard } from "./category-card";
import { CertifiedGmPanel } from "./certified-gm-panel";
import { GrantDialogSlot } from "./grant-dialog-slot";
import { QuizDialogSlot } from "./quiz-dialog-slot";
import { QuizQuestionPanel } from "./quiz-question-panel";

interface RulebookDetailViewProps {
  rulebook: RulebookDetail;
  tab: RulebookDetailTab;
  grantCandidates: GrantCandidate[];
  page?: string;
}

// 기본 정보·본문 퀴즈·인증 현황 세 탭. 인증이 필요 없는 룰북에는 본문 퀴즈 탭이 없고, 저장 영역은 기본 정보 탭에만 있다.
export function RulebookDetailView({
  rulebook,
  tab,
  grantCandidates,
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
        sub={sub}
        actions={
          <Button variant="outline" colorPalette="gray" size="sm" render={<Link href={logHref} />}>
            활동 기록에서 보기
          </Button>
        }
      />
      <RouteTabs label="룰북 상세 화면" items={tabs} value={tabHref} />
      {tab === RULEBOOK_DETAIL_TAB.info ? (
        <RulebookEditForm
          key={rulebook.label}
          rulebook={rulebook}
          aside={<CategoryCard rulebook={rulebook} />}
        />
      ) : (
        <VStack gap="150" className="flex-1 p-200">
          {tab === RULEBOOK_DETAIL_TAB.quiz ? (
            <QuizQuestionPanel questions={rulebook.quizQuestions} />
          ) : (
            <CertifiedGmPanel
              gms={rulebook.certifiedGms}
              certRequired={rulebook.certRequired}
              page={page}
            />
          )}
        </VStack>
      )}
      {tab === RULEBOOK_DETAIL_TAB.quiz ? (
        <QuizDialogSlot rulebookId={rulebook.id} questions={rulebook.quizQuestions} />
      ) : null}
      {tab === RULEBOOK_DETAIL_TAB.gms && rulebook.certRequired ? (
        <GrantDialogSlot
          rulebookId={rulebook.id}
          rulebookLabel={rulebook.label}
          categoryEdition={`${rulebook.category} ${rulebook.edition}`.trim()}
          candidates={grantCandidates}
        />
      ) : null}
    </>
  );
}
