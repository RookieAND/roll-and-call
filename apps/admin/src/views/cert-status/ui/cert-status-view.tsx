import { Chip, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { CERT_TABS, paginate, withQuery } from "@/shared/lib";
import type { CertStatusData } from "@/shared/server";
import {
  AdminHeader,
  CsvExportButton,
  ListPager,
  Panel,
  RouteTabs,
  UrlSearchInput,
} from "@/shared/ui";

import { CERT_STATUS_TAB, type CertStatusTab } from "../model/cert-status-tab";
import { GM_CERT_VIEW, type GmCertView } from "../model/gm-cert-view";
import { CertStatusTabs } from "./cert-status-tabs";
import { CertSummary } from "./cert-summary";
import { EditionCertTable } from "./edition-cert-table";
import { GmCertTable } from "./gm-cert-table";
import { GmDoneTable } from "./gm-done-table";

interface CertStatusViewProps {
  status: CertStatusData;
  tab: CertStatusTab;
  // 판본별: 모든 GM이 인증을 마친 판본까지 볼지. GM별: 조치 필요·인증 완료·전체.
  allEditions: boolean;
  gmView: GmCertView;
  query?: string;
  page?: string;
}

export function CertStatusView({
  status,
  tab,
  allEditions,
  gmView,
  query,
  page,
}: CertStatusViewProps) {
  const gmTab = tab === CERT_STATUS_TAB.gm;
  const openEditions = status.editionRows.filter((row) => row.pendingCount || row.unappliedCount);
  const editionRows = allEditions ? status.editionRows : openEditions;
  const searched = status.gmRows.filter((row) => !query || row.nickname.includes(query));
  const gmGroups = {
    todo: searched.filter((row) => row.state !== "certified"),
    done: searched.filter((row) => row.state === "certified"),
    all: searched,
  };
  const gmRows = gmGroups[gmView];
  const pagedEditions = paginate(editionRows, page);
  const pagedGms = paginate(gmRows, page);
  const paged = gmTab ? pagedGms : pagedEditions;
  const pager = (
    <ListPager
      page={paged.page}
      totalPages={paged.totalPages}
      total={gmTab ? gmRows.length : editionRows.length}
      unit={gmTab ? "명" : "개"}
    />
  );
  const filterChip = (label: string, selected: boolean, href: string) => (
    <Chip key={label} selected={selected} render={<Link href={href} scroll={false} />}>
      {label}
    </Chip>
  );
  const gmHref = (view: GmCertView) =>
    withQuery(
      "/cert/status",
      { tab: CERT_STATUS_TAB.gm, q: query },
      { view: view === GM_CERT_VIEW.todo ? undefined : view },
    );
  const toolbar = gmTab ? (
    <>
      <UrlSearchInput placeholder="닉네임 검색" size="sm" className="w-[180px]" />
      {filterChip(
        `조치 필요 ${gmGroups.todo.length}`,
        gmView === GM_CERT_VIEW.todo,
        gmHref(GM_CERT_VIEW.todo),
      )}
      {filterChip(
        `인증 완료 ${gmGroups.done.length}`,
        gmView === GM_CERT_VIEW.done,
        gmHref(GM_CERT_VIEW.done),
      )}
      {filterChip(
        `전체 ${gmGroups.all.length}`,
        gmView === GM_CERT_VIEW.all,
        gmHref(GM_CERT_VIEW.all),
      )}
    </>
  ) : (
    <>
      {filterChip(`미인증 GM 있음 ${openEditions.length}`, !allEditions, "/cert/status")}
      {filterChip(`전체 ${status.editionRows.length}`, allEditions, "/cert/status?all=1")}
      <CsvExportButton
        fileName="판본별 인증 현황.csv"
        header={["판본", "인증된 GM", "심사 대기", "미신청", "최근 90일 세션"]}
        rows={editionRows.map((row) => [
          row.edition,
          row.certifiedCount,
          row.pendingCount,
          row.unappliedCount,
          row.sessionCount,
        ])}
      />
    </>
  );

  return (
    <>
      <AdminHeader title="룰북 인증" sub="인증 현황" />
      <RouteTabs label="룰북 인증 화면" items={CERT_TABS} value="/cert/status" />
      <VStack gap="150" className="flex-1 p-200">
        <CertSummary summary={status.summary} />
        <Panel footer={pager}>
          <CertStatusTabs
            tab={tab}
            toolbar={toolbar}
            rulebookPanel={<EditionCertTable rows={pagedEditions.rows} />}
            gmPanel={
              gmView === GM_CERT_VIEW.done ? (
                <GmDoneTable rows={pagedGms.rows} />
              ) : (
                <GmCertTable rows={pagedGms.rows} />
              )
            }
          />
        </Panel>
        {gmTab && gmView !== GM_CERT_VIEW.done ? (
          <Text typography="body4" foreground="hint">
            미신청 GM에게는 공지 채널에서 멘션하거나 개별로 연락합니다.
          </Text>
        ) : null}
      </VStack>
    </>
  );
}
