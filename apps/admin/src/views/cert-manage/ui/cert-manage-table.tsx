import { HStack, Table, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import { CERT_MANAGE_STATUS_LABEL, formatDate, type TableSort } from "@/shared/lib";
import {
  CERT_GRANT_METHOD,
  type CertManageSortColumn,
  type OrderedCertManageRow,
} from "@/shared/server";
import {
  EMPTY_IMAGE,
  ServerLink,
  SortableHead,
  TableColumns,
  TableEmptyRow,
  Tag,
} from "@/shared/ui";

import { certRowActions } from "../model/cert-row-actions";
import { CertRowMenu } from "./cert-row-menu";

const METHOD_LABEL = {
  [CERT_GRANT_METHOD.photo]: "사진 심사",
  [CERT_GRANT_METHOD.staff]: "운영진 부여",
} as const;

interface CertManageTableProps {
  rows: OrderedCertManageRow[];
  sort: TableSort<CertManageSortColumn>;
  query: Record<string, string | undefined>;
  noRecords: boolean;
}

export function CertManageTable({ rows, sort, query, noRecords }: CertManageTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[170, 260, 300, 90, 120, { fixed: 64 }]} />
      <Table.Header>
        <Table.Row>
          <SortableHead column="user" label="유저" sort={sort} />
          <Table.Head>판본</Table.Head>
          <Table.Head>인증한 책</Table.Head>
          <Table.Head align="center">상태</Table.Head>
          <SortableHead column="changed" label="최근 변경" sort={sort} />
          <Table.Head aria-label="동작" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {noRecords ? (
          <TableEmptyRow
            colSpan={6}
            image={EMPTY_IMAGE.myGames}
            title="아직 인증 기록이 없습니다"
            description="GM이 룰북 인증을 신청하거나 운영진이 인증을 부여하면 이곳에 표시됩니다."
          />
        ) : null}
        {!noRecords && rows.length === 0 ? (
          <TableEmptyRow
            colSpan={6}
            image={EMPTY_IMAGE.search}
            title="조건에 맞는 인증이 없습니다"
          />
        ) : null}
        {rows.map((row, index) => {
          const showUser = index === 0 || !row.sameUserAsAbove;
          const status = CERT_MANAGE_STATUS_LABEL[row.status];
          return (
            <Table.Row key={row.key}>
              <Table.Cell>
                {showUser ? (
                  <HStack align="center" gap="075" className="min-w-0">
                    <Text
                      typography="body3"
                      weight="bold"
                      truncate
                      render={<ServerLink path={`/users/${row.userId}`} />}
                    >
                      {row.nickname}
                    </Text>
                    {row.sanctioned ? <Tag>제재 중</Tag> : null}
                  </HStack>
                ) : null}
              </Table.Cell>
              <Table.Cell>
                <HStack align="center" gap="075" className="min-w-0">
                  <Text typography="body3" truncate>
                    {row.edition}
                  </Text>
                  {isNull(row.editionEligible) ? null : (
                    <Tag tone={row.editionEligible ? "success" : "gray"}>
                      {row.editionEligible ? "구인 가능" : "일부 인증"}
                    </Tag>
                  )}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <HStack align="baseline" gap="075" className="min-w-0">
                  <Text typography="body3" truncate>
                    {row.rulebook}
                  </Text>
                  <Text typography="body4" foreground="hint" className="flex-none">
                    {METHOD_LABEL[row.method]}
                  </Text>
                </HStack>
              </Table.Cell>
              <Table.Cell align="center">
                <Tag tone={status.tone}>{status.label}</Tag>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint">
                  {formatDate(row.changedAt)}
                </Text>
              </Table.Cell>
              <Table.Cell align="end">
                <CertRowMenu
                  label={`${row.nickname} ${row.rulebook}`}
                  actions={certRowActions({ row, query })}
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
