export type RowTone = "success" | "warning" | "gray" | "primary" | "danger";
export type RowIcon = "check" | "alert" | "clock" | "book";

export interface ListRow {
  key: string;
  icon: RowIcon | null;
  tone: RowTone;
  title: string;
  sub: string;
  subTone?: "muted" | "warning" | "primary" | "danger";
  badge?: { label: string; palette: RowTone };
  fresh?: boolean;
  href?: string;
}
