import { parseSort, stringParams } from "@/shared/lib";
import {
  listReviews,
  REVIEW_DEFAULT_SORT,
  REVIEW_SORT_COLUMNS,
  type ReviewListTab,
} from "@/shared/server";
import { ReviewListView } from "@/views/review-list";

interface ReviewListPageProps {
  tab: ReviewListTab;
  searchParams: Record<string, string | string[] | undefined>;
}

// 전체 후기·숨긴 후기 두 page.tsx가 tab만 다르게 넘긴다.
export async function ReviewListPage({ tab, searchParams }: ReviewListPageProps) {
  const { q, photo, game, sort, dir, page } = stringParams(searchParams);
  const tableSort = parseSort({
    searchParams,
    columns: REVIEW_SORT_COLUMNS,
    fallback: REVIEW_DEFAULT_SORT,
  });
  const list = await listReviews({ tab, query: q, photo, game, sort: tableSort });
  return (
    <ReviewListView
      list={list}
      tab={tab}
      sort={tableSort}
      page={page}
      query={{ q, photo, game, sort, dir }}
    />
  );
}
