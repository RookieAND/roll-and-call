import { isNumber } from "es-toolkit";

export type TableColumnWidth = number | { fixed: number };

interface TableColumnsProps {
  widths: TableColumnWidth[];
}

// 늘어나는 열은 폭을 지정하지 않는다. 퍼센트를 주면 고정 열이 최소 폭까지 눌려 말줄임된다.
// 칸이 좁으면 열을 최소 절반까지 줄이고 말줄임한다. 가로 스크롤은 만들지 않는다(D293).
export function TableColumns({ widths }: TableColumnsProps) {
  return (
    <colgroup>
      {widths.map((width, index) =>
        isNumber(width) ? (
          <col key={index} style={{ minWidth: width / 2 }} />
        ) : (
          <col key={index} style={{ width: width.fixed, minWidth: width.fixed / 2 }} />
        ),
      )}
    </colgroup>
  );
}
