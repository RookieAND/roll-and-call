import { Table } from "@roll-and-call/ui";

import { TableColumns, TABLE_COLUMN } from "@/shared/ui";

interface MakerQueueHeadProps {
  // 행 끝 › 열. 불러오는 중에는 없다.
  linked: boolean;
}

export function MakerQueueHead({ linked }: MakerQueueHeadProps) {
  return (
    <>
      <TableColumns
        widths={[
          TABLE_COLUMN.nickname,
          TABLE_COLUMN.title,
          TABLE_COLUMN.dateTime,
          ...(linked ? [TABLE_COLUMN.chevron] : []),
        ]}
      />
      <Table.Header>
        <Table.Row>
          <Table.Head>신청자</Table.Head>
          <Table.Head>룰 이름</Table.Head>
          <Table.Head>신청 일시</Table.Head>
          {linked ? <Table.Head /> : null}
        </Table.Row>
      </Table.Header>
    </>
  );
}
