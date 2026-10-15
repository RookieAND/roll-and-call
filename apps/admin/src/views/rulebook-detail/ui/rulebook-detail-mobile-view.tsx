import { HStack } from "@roll-and-call/ui";

import type { RulebookDetail } from "@/entities/rulebook/server";
import { MobileRulebookEditForm } from "@/features/write-rulebook";
import type { TableSort } from "@/shared/lib";
import { AdminHeader, RouteTabs, TabCount } from "@/shared/ui";

import type { CertifiedGmSortColumn } from "../model/certified-gm-sort";
import { RULEBOOK_DETAIL_TAB, type RulebookDetailTab } from "../model/rulebook-detail-tab";
import { CertifiedGmRows } from "./mobile/certified-gm-rows";
import { QuizRows } from "./mobile/quiz-rows";
import { RulebookKindNotices } from "./mobile/rulebook-kind-notices";

interface RulebookDetailMobileViewProps {
  rulebook: RulebookDetail;
  tab: RulebookDetailTab;
  gmSort: TableSort<CertifiedGmSortColumn>;
  viewerId: string;
}

// 문항 창은 데스크톱 View의 QuizDialogSlot이 주소(question)를 보고 띄운다(모바일에선 시트).
export function RulebookDetailMobileView({
  rulebook,
  tab,
  gmSort,
  viewerId,
}: RulebookDetailMobileViewProps) {
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
      <AdminHeader title={rulebook.label} trail={[{ href: "/rules", label: "룰북" }]} />
      {tab === RULEBOOK_DETAIL_TAB.info ? <RulebookKindNotices rulebook={rulebook} /> : null}
      <RouteTabs label="룰북 상세 화면" items={tabs} value={tabHref} />
      {tab === RULEBOOK_DETAIL_TAB.info ? (
        <MobileRulebookEditForm key={rulebook.label} rulebook={rulebook} viewerId={viewerId} />
      ) : null}
      {tab === RULEBOOK_DETAIL_TAB.quiz ? (
        <QuizRows rulebookId={rulebook.id} questions={rulebook.quizQuestions} />
      ) : null}
      {tab === RULEBOOK_DETAIL_TAB.gms ? (
        <CertifiedGmRows
          rulebookId={rulebook.id}
          kind={rulebook.kind}
          gms={rulebook.certifiedGms}
          certRequired={rulebook.certRequired}
          sort={gmSort}
        />
      ) : null}
    </>
  );
}
