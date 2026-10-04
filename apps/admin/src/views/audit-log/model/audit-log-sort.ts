import { SORT_DIR } from "@/shared/lib";

// 정렬은 일시 하나다(D200). 기본 ↓, 다시 누르면 ↑.
export const AUDIT_LOG_SORT = {
  columns: { at: SORT_DIR.desc },
  fallback: { column: "at", dir: SORT_DIR.desc },
} as const;
