import { isNumber } from "es-toolkit";

export type TableColumnWidth = number | { fixed: number };

interface TableColumnsProps {
  widths: TableColumnWidth[];
}

// 늘어나는 열마다 같은 퍼센트를 줘야 균등하게 나뉜다. 브라우저가 열의 calc(%)를 auto로 취급해서 여기서 계산한다.
// 칸이 좁으면 열을 최소 절반까지 줄이고 말줄임한다. 가로 스크롤은 만들지 않는다(D293).
export function TableColumns({ widths }: TableColumnsProps) {
  const growingCount = widths.filter((width) => isNumber(width)).length;
  return (
    <colgroup>
      {widths.map((width, index) =>
        isNumber(width) ? (
          <col key={index} style={{ width: `${100 / growingCount}%`, minWidth: width / 2 }} />
        ) : (
          <col key={index} style={{ width: width.fixed, minWidth: width.fixed / 2 }} />
        ),
      )}
    </colgroup>
  );
}
