export type TableColumnWidth = number | { fixed: number };

interface TableColumnsProps {
  widths: TableColumnWidth[];
}

// table-equal 표의 열 폭. 숫자는 최소 폭이고 남는 폭을 똑같이 나눠 받는다. { fixed }는 아이콘 칸처럼 늘지 않는다.
// 늘어나는 열마다 같은 퍼센트를 줘야 균등하게 나뉜다. 브라우저가 열의 calc(%)를 auto로 취급해서 여기서 계산한다.
export function TableColumns({ widths }: TableColumnsProps) {
  const growingCount = widths.filter((width) => typeof width === "number").length;
  return (
    <colgroup>
      {widths.map((width, index) =>
        typeof width === "number" ? (
          <col key={index} style={{ width: `${100 / growingCount}%`, minWidth: width }} />
        ) : (
          <col key={index} style={{ width: width.fixed, minWidth: width.fixed }} />
        ),
      )}
    </colgroup>
  );
}
