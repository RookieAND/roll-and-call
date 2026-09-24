import { Chip, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { CERT_TABS, formatMonthDay, withQuery } from "@/shared/lib";
import type { CertStatusData } from "@/shared/server";
import { AdminHeader, Panel, RouteTabs, UrlSelect, UserPreview } from "@/shared/ui";

import { CERT_STATUS_TAB, type CertStatusTab } from "../model/cert-status-tab";
import { CertStatusTabs } from "./cert-status-tabs";
import { CertSummary } from "./cert-summary";
import { CsvExportButton } from "./csv-export-button";
import { GmCertTable } from "./gm-cert-table";
import { RulebookCertTable } from "./rulebook-cert-table";

interface CertStatusViewProps {
  status: CertStatusData;
  tab: CertStatusTab;
  allTime: boolean;
  unappliedOnly: boolean;
}

export function CertStatusView({ status, tab, allTime, unappliedOnly }: CertStatusViewProps) {
  const gmTab = tab === CERT_STATUS_TAB.gm;
  const { enforcementDate } = status.guideDm;
  const enforcementFrom = enforcementDate ? `${formatMonthDay(enforcementDate)}부터` : "적용일부터";
  const sessionLabel = allTime ? "전체 세션" : "최근 90일 세션";
  const gmRows = unappliedOnly
    ? status.gmRows.filter((row) => row.state === "unapplied")
    : status.gmRows;
  const unappliedHref = withQuery(
    "/cert/status",
    { tab: CERT_STATUS_TAB.gm },
    { unapplied: unappliedOnly ? undefined : "1" },
  );
  const toolbar = gmTab ? (
    <Chip selected={unappliedOnly} render={<Link href={unappliedHref} scroll={false} />}>
      미신청만
    </Chip>
  ) : (
    <>
      <UrlSelect
        param="scope"
        allLabel="최근 90일 활동 GM"
        options={[{ label: "전체 기간", value: "all" }]}
        className="w-[162px] [&_[data-slot=select-trigger]]:h-[32px] [&_[data-slot=select-trigger]]:min-h-[32px]"
      />
      <CsvExportButton
        fileName="룰북별 인증 현황.csv"
        header={["룰북", "인증된 GM", "심사 대기", "미신청", sessionLabel]}
        rows={status.rulebookRows.map((row) => [
          row.rulebook,
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
        <CertSummary summary={status.summary} week={status.week} />
        <Panel className="flex-1">
          <CertStatusTabs
            tab={tab}
            toolbar={toolbar}
            rulebookPanel={
              <RulebookCertTable rows={status.rulebookRows} sessionLabel={sessionLabel} />
            }
            gmPanel={<GmCertTable rows={gmRows} />}
          />
        </Panel>
        {gmTab ? (
          <>
            <UserPreview title="[안내 DM]으로 보내는 문구">
              {status.guideDm.rulebook} 등 인증이 필요한 룰북은 {enforcementFrom} 인증을 받아야
              구인을 열 수 있어요. 앱의 [마이페이지 → GM 룰북]에서 사진 3장(앞·뒤·옆)을 올려 신청해
              주세요.
            </UserPreview>
            <Text typography="body4" foreground="hint">
              제재 중인 사용자에게는 안내 DM을 보낼 수 없습니다.
            </Text>
          </>
        ) : null}
      </VStack>
    </>
  );
}
