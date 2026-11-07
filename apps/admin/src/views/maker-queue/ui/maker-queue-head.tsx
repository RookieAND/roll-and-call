import { Table } from "@roll-and-call/ui";

import { TableColumns } from "@/shared/ui";

interface MakerQueueHeadProps {
  // 행 끝 › 열. 불러오는 중에는 없다.
  linked: boolean;
}

export function MakerQueueHead({ linked }: MakerQueueHeadProps) {
  return (
    <>
      <TableColumns
        widths={[{ fixed: 180 }, 320, { fixed: 180 }, ...(linked ? [{ fixed: 44 }] : [])]}
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
