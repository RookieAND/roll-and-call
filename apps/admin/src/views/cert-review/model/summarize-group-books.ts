import type { CertStatus } from "@/shared/server";

import {
  GROUP_STATUS_ORDER,
  GROUP_STATUS_SHORT_LABEL,
  GROUP_SUMMARY_ORDER,
  type GroupBookEntry,
} from "./group-books";

export interface GroupBookGroup {
  status: CertStatus;
  books: GroupBookEntry[];
}

export interface GroupBooksSummary {
  current: GroupBookEntry | undefined;
  summaryText: string;
  groups: GroupBookGroup[];
}

// 건수 줄에는 지금 보는 책까지 센다. 묶음에는 지금 보는 책을 넣지 않는다(위 줄에 따로 보인다).
export function summarizeGroupBooks(books: GroupBookEntry[]): GroupBooksSummary {
  const current = books.find((book) => book.current);
  const statusCounts = GROUP_SUMMARY_ORDER.map((status) => ({
    status,
    count: books.filter((book) => book.status === status).length,
  })).filter(({ count }) => count > 0);
  const countTexts = statusCounts.map(
    ({ status, count }) => `${GROUP_STATUS_SHORT_LABEL[status]} ${count}`,
  );
  const summaryText = [`총 ${books.length}권`, ...countTexts].join(" · ");
  const groups = GROUP_STATUS_ORDER.map((status) => ({
    status,
    books: books.filter((book) => book.status === status && !book.current),
  })).filter(({ books: groupBooks }) => groupBooks.length > 0);

  return { current, summaryText, groups };
}
