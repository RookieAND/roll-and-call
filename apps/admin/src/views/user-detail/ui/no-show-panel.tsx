import { Button, Table, Text, VStack } from "@roll-and-call/ui";
import { Check, Flag, X } from "lucide-react";
import Link from "next/link";

import { formatMonthDay, formatSessionTime, withQuery } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { IconBadge, ItemCard, Panel } from "@/shared/ui";

interface NoShowPanelProps {
  nickname: string;
  noShows: UserDetail["noShows"];
}

export function NoShowPanel({ nickname, noShows }: NoShowPanelProps) {
  const validCount = noShows.filter((noShow) => !noShow.cancelled).length;
  const latestValid = noShows.find((noShow) => !noShow.cancelled);
  return (
    <VStack gap="150">
      <Panel
        title="불참 기록"
        right={
          <Text typography="body4" foreground="hint">
            유효 {validCount}건 · 취소됨 {noShows.length - validCount}건
          </Text>
        }
      >
        <Table.Root className="table-fixed">
          <colgroup>
            <col className="w-[150px]" />
            <col />
            <col className="w-[100px]" />
            <col className="w-[96px]" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.Head>일시</Table.Head>
              <Table.Head>세션</Table.Head>
              <Table.Head>처리한 GM</Table.Head>
              <Table.Head>상태</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {noShows.map((noShow) => (
              <Table.Row key={noShow.id} className={noShow.cancelled ? "opacity-50" : undefined}>
                <Table.Cell>
                  <Text typography="body3" foreground="hint" numeric>
                    {formatSessionTime(noShow.startsAt)}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text typography="body3" truncate title={noShow.sessionTitle}>
                    {noShow.sessionTitle}
                  </Text>
                </Table.Cell>
                <Table.Cell>{noShow.gmNickname}</Table.Cell>
                <Table.Cell>
                  {noShow.cancelled ? (
                    <IconBadge icon={X} colorPalette="gray">
                      취소됨
                    </IconBadge>
                  ) : (
                    <IconBadge icon={Check} colorPalette="gray">
                      유효
                    </IconBadge>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Panel>
      {latestValid ? (
        <ItemCard
          icon={Flag}
          tone="danger"
          title="최근 불참 기록"
          meta={`${latestValid.sessionTitle} · ${formatMonthDay(latestValid.startsAt)}`}
          right={
            <Button
              variant="outline"
              colorPalette="gray"
              size="sm"
              render={
                <Link href={withQuery("/noshow", {}, { q: nickname, record: latestValid.id })} />
              }
            >
              기록 열기
            </Button>
          }
        >
          당사자에게 사정을 들었다면 기록을 열어서 불참을 취소할 수 있습니다.
        </ItemCard>
      ) : null}
    </VStack>
  );
}
