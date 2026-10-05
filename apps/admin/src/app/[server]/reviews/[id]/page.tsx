import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { parseSort, stringParams } from "@/shared/lib";
import {
  getReviewDetail,
  REVIEW_DEFAULT_SORT,
  REVIEW_LIST_TAB,
  REVIEW_SORT_COLUMNS,
  requireStaff,
} from "@/shared/server";
import { ReviewDetailView } from "@/views/review-detail";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/reviews/[id]">): Promise<Metadata> {
  const filter = { tab: REVIEW_LIST_TAB.all, sort: REVIEW_DEFAULT_SORT };
  const review = await getReviewDetail({ id: (await params).id, filter });
  return { title: review ? review.game.title : "후기 상세" };
}

// 들어온 목록의 탭·검색·사진·구인 칩·정렬을 주소로 받아 뒤로 가기와 [다음 건]을 만든다.
export default async function ReviewDetailPage({
  params,
  searchParams,
}: PageProps<"/[server]/reviews/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { tab, q, photo, game, sort, dir } = stringParams(query);
  const listTab = tab === REVIEW_LIST_TAB.hidden ? REVIEW_LIST_TAB.hidden : REVIEW_LIST_TAB.all;
  const tableSort = parseSort({
    searchParams: query,
    columns: REVIEW_SORT_COLUMNS,
    fallback: REVIEW_DEFAULT_SORT,
  });
  const [review, staff] = await Promise.all([
    getReviewDetail({ id, filter: { tab: listTab, query: q, photo, game, sort: tableSort } }),
    requireStaff(),
  ]);
  if (!review) notFound();
  return (
    <ReviewDetailView
      review={review}
      tab={listTab}
      listQuery={{ q, photo, game, sort, dir }}
      viewerId={staff.id}
    />
  );
}
