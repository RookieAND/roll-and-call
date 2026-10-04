import { Button, Callout, Table, Text, VStack } from "@roll-and-call/ui";
import { Ban } from "lucide-react";

import { paginate } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import {
  EMPTY_IMAGE,
  ListPager,
  Panel,
  ServerLink,
  TableColumns,
  TableEmptyRow,
  Tag,
} from "@/shared/ui";

import { CERT_ROW_LABEL, CERT_ROW_STATE, toCertRows } from "../model/to-cert-rows";

interface CertPanelProps {
  user: UserDetail;
  page?: string;
}

export function CertPanel({ user, page }: CertPanelProps) {
  const rows = toCertRows(user);
  const paged = paginate(rows, page);
  return (
    <VStack gap="150">
      {user.sanction ? (
        <Callout.Root colorPalette="gray">
          <Callout.Icon>
            <Ban size={14} strokeWidth={2.2} />
          </Callout.Icon>
          <Callout.Description>
            제재 기간에는 인증된 룰북이 있어도 구인을 개설할 수 없습니다.
          </Callout.Description>
        </Callout.Root>
      ) : null}
      <Panel
        footer={
          <ListPager
            page={paged.page}
            totalPages={paged.totalPages}
            total={rows.length}
            unit="개"
          />
        }
      >
        <Table.Root className="table-equal">
          <TableColumns
            widths={[0, { fixed: 88 }, { fixed: 160 }, { fixed: 104 }, { fixed: 156 }]}
          />
          <Table.Header>
            <Table.Row>
              <Table.Head>룰북</Table.Head>
              <Table.Head align="center">상태</Table.Head>
              <Table.Head>일자</Table.Head>
              <Table.Head>처리한 운영진</Table.Head>
              <Table.Head aria-label="조치" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.length === 0 ? (
              <TableEmptyRow
                colSpan={5}
                image={EMPTY_IMAGE.myGames}
                title="룰북 인증 기록이 없습니다"
                description="인증을 신청하면 심사 결과가 이곳에 쌓입니다."
              />
            ) : null}
            {paged.rows.map((row) => {
              const state = CERT_ROW_LABEL[row.state];
              return (
                <Table.Row
                  key={row.key}
                  className={row.state === CERT_ROW_STATE.rejected ? "opacity-50" : undefined}
                >
                  <Table.Cell>
                    <VStack gap="025" className="min-w-0">
                      <Text typography="body3" weight="bold" truncate>
                        {row.rulebook}
                      </Text>
                      {row.reason ? (
                        <Text typography="body4" foreground="hint" truncate title={row.reason}>
                          {`사유: ${row.reason}`}
                        </Text>
                      ) : null}
                    </VStack>
                  </Table.Cell>
                  <Table.Cell align="center">
                    <Tag tone={state.tone}>{state.label}</Tag>
                  </Table.Cell>
                  <Table.Cell>
                    <Text typography="body3" foreground="hint">
                      {row.date}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {row.staff ?? (
                      <Text typography="body3" foreground="hint">
                        -
                      </Text>
                    )}
                  </Table.Cell>
                  <Table.Cell align="end">
                    {row.action ? (
                      <Button
                        variant="outline"
                        colorPalette="gray"
                        size="sm"
                        render={<ServerLink path={row.action.href} />}
                      >
                        {row.action.label}
                      </Button>
                    ) : null}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Panel>
    </VStack>
  );
}
