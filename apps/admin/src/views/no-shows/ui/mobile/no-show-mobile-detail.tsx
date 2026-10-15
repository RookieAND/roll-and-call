import { Button, Callout, Text, VStack } from "@roll-and-call/ui";

import type { NoShowDetail } from "@/entities/no-show/server";
import { formatDateTime, formatSessionTime, withQuery } from "@/shared/lib";
import {
  AdminHeader,
  KeyValueList,
  MobileDetailBar,
  MobileSection,
  MobileTitle,
  ServerLink,
} from "@/shared/ui";

import { recentCountFacts } from "../../model/recent-count-facts";

const REPEATED_NO_SHOW_COUNT = 2;

interface NoShowMobileDetailProps {
  record: NoShowDetail;
  query: Record<string, string | undefined>;
}

// 아래 버튼은 데스크톱과 같은 ?record= 시트(불참 취소 / 취소된 기록 안내)를 연다.
export function NoShowMobileDetail({ record, query }: NoShowMobileDetailProps) {
  const listHref = withQuery("/noshow", query, { detail: undefined });
  const sheetHref = withQuery("/noshow", query, { record: record.id });
  const facts = recentCountFacts(record);
  const countValue = (count: number) => (
    <Text
      typography="body2"
      weight="bold"
      foreground={count >= REPEATED_NO_SHOW_COUNT ? "danger" : "normal"}
      render={<span />}
    >
      {count}회
    </Text>
  );
  const reasonItem = record.added
    ? { label: "추가 사유", value: record.added.reason }
    : { label: "GM이 남긴 사유", value: record.gmReason ?? "없음" };
  const cancellationItems = record.cancellation
    ? [
        { label: "취소 사유", value: record.cancellation.reason },
        {
          label: "취소한 운영진",
          value: `${record.cancellation.by} · ${formatDateTime(record.cancellation.at)}`,
        },
      ]
    : [];
  const primary = record.cancellation ? (
    <Button
      variant="outline"
      colorPalette="gray"
      render={<ServerLink path={sheetHref} scroll={false} />}
    >
      취소 되돌리기
    </Button>
  ) : (
    <Button
      variant="outline"
      colorPalette="danger"
      render={<ServerLink path={sheetHref} scroll={false} />}
    >
      불참 취소
    </Button>
  );

  return (
    <>
      <AdminHeader
        title={<MobileTitle title={record.nickname} sub="불참 기록" />}
        trail={[{ href: listHref, label: "불참 기록" }]}
      />
      <VStack gap="150" className="px-150 pt-150 pb-200">
        {record.cancellation ? (
          <Callout.Root colorPalette="gray">
            <Callout.Icon />
            <Callout.Title>이 기록은 불참 횟수에서 빠졌습니다</Callout.Title>
            <Callout.Description>다시 불참으로 되돌릴 수 있습니다.</Callout.Description>
          </Callout.Root>
        ) : null}
        <MobileSection flush>
          <KeyValueList
            items={[
              { label: "불참 당사자", value: record.nickname },
              { label: "세션", value: record.sessionTitle },
              { label: "룰북", value: record.rulebook },
              { label: "일시", value: formatSessionTime(record.startsAt) },
              { label: "처리한 사람", value: record.handler },
              reasonItem,
              ...cancellationItems,
            ]}
          />
        </MobileSection>
        {facts ? (
          <MobileSection title="최근 30일 불참">
            <KeyValueList
              columns={2}
              items={[
                { label: "이 기록 제외", value: countValue(facts.without) },
                { label: "이 기록 포함", value: countValue(facts.with) },
              ]}
            />
          </MobileSection>
        ) : null}
      </VStack>
      <MobileDetailBar primary={primary} />
    </>
  );
}
