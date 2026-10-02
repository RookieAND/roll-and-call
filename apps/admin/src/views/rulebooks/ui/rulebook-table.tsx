import { Table } from "@roll-and-call/ui";

import { quoteWithParticle } from "@/shared/lib";
import type { RulebookCategory, RulebookRow } from "@/shared/server";
import { EMPTY_IMAGE, TableColumns, TableEmptyRow } from "@/shared/ui";

import { withAndParticle } from "../model/with-and-particle";
import { CategoryRow } from "./category-row";
import { RulebookBookRow } from "./rulebook-book-row";

interface RulebookTableProps {
  groups: { category: RulebookCategory; rows: RulebookRow[] }[];
  query?: string;
}

export function RulebookTable({ groups, query }: RulebookTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[320, 120, 120, { fixed: 44 }]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>룰북</Table.Head>
          <Table.Head>판본</Table.Head>
          <Table.Head align="center">종류</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {groups.length === 0 ? (
          <TableEmptyRow
            colSpan={4}
            image={EMPTY_IMAGE.search}
            title={
              query
                ? `${quoteWithParticle(query, withAndParticle)} 일치하는 룰북이 없습니다`
                : "조건에 맞는 룰북이 없습니다"
            }
            description="이름, 판본, 카테고리, 다른 이름에서 찾았습니다. 추가 요청 탭에 같은 이름이 있는지 확인하거나 룰북을 새로 추가해 주세요."
          />
        ) : null}
        {groups.map(({ category, rows }) => [
          <CategoryRow key={category.name} category={category} />,
          ...rows.map((row, index) => (
            <RulebookBookRow key={row.id} row={row} last={index === rows.length - 1} />
          )),
        ])}
      </Table.Body>
    </Table.Root>
  );
}
