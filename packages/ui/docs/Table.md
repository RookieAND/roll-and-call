---
category: Layout
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다. `Header`·`Body`·`Footer`·`Caption`은 그 외 고유 prop이 없다.

```ts
Table.Root: {
  size?: "sm" | "md"; // 기본 md. sm은 관리 화면처럼 한 화면에 많이 보여야 할 때
}

Table.Row: {
  selected?: boolean; // 기본 false
  interactive?: boolean; // 기본 false. hover 배경만 준다, 이동은 행 안의 링크가 맡는다
}

Table.Head: {
  align?: "start" | "center" | "end"; // 기본 start
  numeric?: boolean; // 기본 false
}

Table.Cell: {
  align?: "start" | "center" | "end"; // 기본 start
  numeric?: boolean; // 기본 false. 숫자는 tabular-nums로 정렬
}
```

## 언제 쓰나

참여자 명단, 신청 현황처럼 여러 행을 같은 열 구조로 비교해서 보여줄 때 쓴다.

## 쓰지 않을 때

행마다 설명이 붙는 소수 항목은 `Card`나 `RadioCard`를 쓴다. 값 한두 개만 보여줄 땐 `Table` 대신 `Text`/`HStack`으로 충분하다.

## 함께 쓰는 것

`Table.Root` 안에 `Table.Header`(`Table.Row` + `Table.Head`들) · `Table.Body`(`Table.Row` + `Table.Cell`들)를 필수로 두고, 필요하면 `Table.Footer`·`Table.Caption`을 더한다. 상태 열에는 `Badge`를 함께 쓴다.

## 예제

```tsx
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
        <Badge>대기</Badge>
      </Table.Cell>
      <Table.Cell align="end" numeric>
        4/6
      </Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

```tsx
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
```

```tsx
<Table.Row interactive>
  <Table.Cell>크툴루의 부름 단편</Table.Cell>
  <Table.Cell>달빛</Table.Cell>
  <Table.Cell align="end" numeric>
    8명
  </Table.Cell>
</Table.Row>
```

## data-* · 접근성

`data-slot`: `table-container`(테두리·스크롤을 맡는 바깥 div, `data-size` 포함) · `table`(Root, `<table>` 자체) · `table-header` · `table-body` · `table-footer` · `table-row`(+ `data-selected`·`data-interactive`는 참일 때만) · `table-head`(`scope="col"`, `data-align`·`data-numeric`) · `table-cell`(`data-align`·`data-numeric`) · `table-caption`.

`selected`가 켜진 `Table.Row`는 `aria-selected="true"`도 함께 받는다. `size="sm"`은 바깥 컨테이너의 `data-size`를 통해 CSS로 셀 높이를 줄인다(각 셀에 직접 주는 값이 아니다). 넘치는 내용은 표 자체만 가로 스크롤되고 테두리·모서리는 바깥 상자가 맡는다.
