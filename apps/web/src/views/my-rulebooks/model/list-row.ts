export type RowTone = "success" | "warning" | "gray" | "primary" | "danger";
export type RowIcon = "check" | "alert" | "clock" | "book";

// 내 룰북의 한 줄(인증 현황·추가 요청). 아이콘 모양은 icon(없으면 비움), 색은 tone.
export interface ListRow {
  key: string;
  icon: RowIcon | null;
  tone: RowTone;
  title: string;
  sub: string;
  subTone?: "muted" | "warning" | "primary" | "danger";
  badge?: { label: string; palette: RowTone };
  // 최근 7일 안에 나온 결과.
  fresh?: boolean;
  href?: string;
}
