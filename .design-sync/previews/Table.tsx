import { Badge, Table } from "@roll-and-call/ui";

export const ParticipantTable = () => (
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>이름</Table.Head>
        <Table.Head>역할</Table.Head>
        <Table.Head>상태</Table.Head>
        <Table.Head align="end" numeric>
          정원
        </Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>달빛</Table.Cell>
        <Table.Cell>GM</Table.Cell>
        <Table.Cell>
          <Badge colorPalette="success">확정</Badge>
        </Table.Cell>
        <Table.Cell align="end" numeric>
          1/1
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>새벽</Table.Cell>
        <Table.Cell>PL</Table.Cell>
        <Table.Cell>
          <Badge colorPalette="success">확정</Badge>
        </Table.Cell>
        <Table.Cell align="end" numeric>
          4/6
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>파도</Table.Cell>
        <Table.Cell>PL</Table.Cell>
        <Table.Cell>
          <Badge>대기</Badge>
        </Table.Cell>
        <Table.Cell align="end" numeric>
          4/6
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
);

export const CompactSessionTable = () => (
  <Table.Root size="sm">
    <Table.Header>
      <Table.Row>
        <Table.Head>세션</Table.Head>
        <Table.Head>일정</Table.Head>
        <Table.Head>상태</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row selected>
        <Table.Cell>크툴루의 부름 단편</Table.Cell>
        <Table.Cell>토요일 오후 2시</Table.Cell>
        <Table.Cell>
          <Badge colorPalette="success">확정</Badge>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>디아스포라 3화</Table.Cell>
        <Table.Cell>일정 조율 중</Table.Cell>
        <Table.Cell>
          <Badge colorPalette="warning">마감 임박</Badge>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
    <Table.Caption>최근 신청한 세션 2건</Table.Caption>
  </Table.Root>
);

export const InteractiveGameTable = () => (
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>게임</Table.Head>
        <Table.Head>GM</Table.Head>
        <Table.Head align="end" numeric>
          신청 인원
        </Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row interactive>
        <Table.Cell>크툴루의 부름 단편</Table.Cell>
        <Table.Cell>달빛</Table.Cell>
        <Table.Cell align="end" numeric>
          8명
        </Table.Cell>
      </Table.Row>
      <Table.Row interactive>
        <Table.Cell>디아스포라 3화</Table.Cell>
        <Table.Cell>새벽</Table.Cell>
        <Table.Cell align="end" numeric>
          5명
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
);
