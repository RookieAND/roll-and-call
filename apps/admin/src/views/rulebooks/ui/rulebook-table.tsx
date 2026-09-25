import { Table } from "@roll-and-call/ui";

import type { RulebookCategory, RulebookRow } from "@/shared/server";
import { EMPTY_IMAGE, TableColumns, TableEmptyRow } from "@/shared/ui";

import { CategoryRow } from "./category-row";
import { RulebookBookRow } from "./rulebook-book-row";

interface RulebookTableProps {
  groups: { category: RulebookCategory; rows: RulebookRow[] }[];
  query?: string;
}

export function RulebookTable({ groups, query }: RulebookTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[220, 132, 96, 200, 104, 82, 78, { fixed: 44 }]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>룰북</Table.Head>
          <Table.Head>판본</Table.Head>
          <Table.Head align="center">종류</Table.Head>
          <Table.Head>다른 이름</Table.Head>
          <Table.Head align="center">인증</Table.Head>
          <Table.Head align="center">상태</Table.Head>
          <Table.Head align="center">인증 GM</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {groups.length === 0 ? (
          <TableEmptyRow
            colSpan={8}
            image={EMPTY_IMAGE.search}
            title={query ? `「${query}」에 맞는 룰북이 없습니다` : "조건에 맞는 룰북이 없습니다"}
            description="이름, 판본, 카테고리, 다른 이름에서 찾았습니다. 위의 추가 요청에 같은 이름이 있는지 확인하거나 룰북을 새로 추가해 주세요."
          />
        ) : null}
        {groups.map(({ category, rows }) => [
          <CategoryRow key={category.name} category={category} />,
          ...rows.map((row) => <RulebookBookRow key={row.id} row={row} />),
        ])}
      </Table.Body>
    </Table.Root>
  );
}
