import type { RulebookKind } from "@roll-and-call/database";
import { RULEBOOK_KIND } from "@roll-and-call/database/rulebooks/model";
import { Button, Table, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { formatDate, paginate, sortRows, withQuery, type TableSort } from "@/shared/lib";
import type { CertifiedGm } from "@/shared/server";
import {
  EMPTY_IMAGE,
  ListPager,
  Panel,
  ServerLink,
  SortableHead,
  TableColumns,
  TableEmptyRow,
} from "@/shared/ui";

import type { CertifiedGmSortColumn } from "../model/certified-gm-sort";

interface CertifiedGmPanelProps {
  rulebookId: string;
  kind: RulebookKind;
  gms: CertifiedGm[];
  certRequired: boolean;
  sort: TableSort<CertifiedGmSortColumn>;
  page?: string;
}

export function CertifiedGmPanel({
  rulebookId,
  kind,
  gms,
  certRequired,
  sort,
  page,
}: CertifiedGmPanelProps) {
  const sorted = sortRows({
    rows: gms,
    sort,
    accessors: { approved: (gm) => gm.approvedAt, sessions: (gm) => gm.recentSessionCount },
  });
  const paged = paginate(sorted, page);
  const title = kind === RULEBOOK_KIND.core ? "이 룰북으로 인증된 GM" : "인증한 사람";
  const right = certRequired ? (
    <Button
      variant="outline"
      colorPalette="gray"
      size="sm"
      render={<ServerLink path={withQuery("/cert/manage", {}, { rulebook: rulebookId })} />}
    >
      인증 관리에서 보기
    </Button>
  ) : (
    <Text typography="body4" foreground="hint">
      인증이 필요 없는 룰북이므로 인증을 부여하지 않아도 됩니다
    </Text>
  );
  return (
    <Panel
      title={title}
      right={right}
      footer={
        <ListPager page={paged.page} totalPages={paged.totalPages} total={gms.length} unit="명" />
      }
    >
      <Table.Root className="table-equal">
        <TableColumns widths={[180, 140, 140, { fixed: 44 }]} />
        <Table.Header>
          <Table.Row>
            <Table.Head>닉네임</Table.Head>
            <SortableHead column="approved" label="인증일" sort={sort} />
            <SortableHead column="sessions" label="최근 90일 세션" sort={sort} align="end" />
            <Table.Head />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {gms.length === 0 ? (
            <TableEmptyRow
              colSpan={4}
              image={EMPTY_IMAGE.myGames}
              title="이 룰북으로 인증된 GM이 없습니다"
              description={
                certRequired
                  ? "GM의 인증 신청이 승인되거나 인증 관리에서 인증을 부여하면 이곳에 표시됩니다."
                  : "인증이 필요 없는 룰북이므로 누구나 이 룰북으로 구인을 열 수 있습니다."
              }
            />
          ) : null}
          {paged.rows.map((gm) => (
            <Table.Row key={gm.userId} interactive className="relative">
              <Table.Cell>
                <Text
                  typography="body3"
                  weight="bold"
                  truncate
                  render={<ServerLink path={`/users/${gm.userId}`} />}
                  className="block after:absolute after:inset-0"
                >
                  {gm.nickname}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint">
                  {formatDate(gm.approvedAt)}
                </Text>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {gm.recentSessionCount}회
              </Table.Cell>
              <Table.Cell align="end">
                <ChevronRight size={16} aria-hidden className="inline text-hint" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Panel>
  );
}
