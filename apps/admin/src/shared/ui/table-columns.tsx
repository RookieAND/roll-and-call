import { isNumber } from "es-toolkit";

export type TableColumnWidth = number | { fixed: number };

// 열 폭 토큰. 제목은 표마다 늘어나는 열 하나이고 최소 폭만 준다. 퍼센트 폭은 쓰지 않는다.
export const TABLE_COLUMN = {
  chevron: { fixed: 44 },
  icon: { fixed: 64 },
  // 라벨 2~3자 / 4~6자
  action: { fixed: 96 },
  actionLong: { fixed: 120 },
  // 기본 / 복수·긴 뱃지 / 활동 기록 조치명
  badge: { fixed: 96 },
  badgeLong: { fixed: 120 },
  badgeAction: { fixed: 160 },
  date: { fixed: 140 },
  dateTime: { fixed: 192 },
  // 머리글 4자 이하 / 5~6자 / 7자 이상
  number: { fixed: 72 },
  numberMid: { fixed: 88 },
  numberLong: { fixed: 120 },
  nickname: { fixed: 150 },
  staff: { fixed: 140 },
  rulebook: { fixed: 140 },
  title: 240,
} as const satisfies Record<string, TableColumnWidth>;

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
