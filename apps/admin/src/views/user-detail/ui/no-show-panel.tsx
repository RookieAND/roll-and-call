import { Badge, Button, Table, Text, VStack } from "@roll-and-call/ui";
import { Flag } from "lucide-react";
import Link from "next/link";

import { formatDate, formatSessionTime, withQuery } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { EMPTY_IMAGE, ItemCard, Panel, TableEmptyRow } from "@/shared/ui";

interface NoShowPanelProps {
  nickname: string;
  noShows: UserDetail["noShows"];
}

export function NoShowPanel({ nickname, noShows }: NoShowPanelProps) {
  const latestValid = noShows.find((noShow) => !noShow.cancelled);
  return (
    <VStack gap="150">
      <Panel title="불참 기록">
        <Table.Root className="table-fixed">
          <colgroup>
            <col className="w-[192px]" />
            <col />
            <col className="w-[100px]" />
            <col className="w-[88px]" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.Head>일시</Table.Head>
              <Table.Head>세션</Table.Head>
              <Table.Head>처리한 GM</Table.Head>
              <Table.Head align="center">상태</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {noShows.length === 0 ? (
              <TableEmptyRow
                colSpan={4}
                image={EMPTY_IMAGE.schedule}
                title="불참 기록이 없습니다"
                description="GM이 세션을 마친 뒤 불참을 처리하면 이곳에 기록됩니다."
              />
            ) : null}
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
                <Table.Cell align="center">
                  {noShow.cancelled ? (
                    <Badge colorPalette="gray">취소됨</Badge>
                  ) : (
                    <Badge colorPalette="danger">유효</Badge>
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
          tone="warning"
          title="최근 불참 기록"
          meta={`${latestValid.sessionTitle} · ${formatDate(latestValid.startsAt)}`}
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
