import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { REVIEW_DEFAULT_SORT, REVIEW_LIST_TAB, REVIEW_SORT_COLUMNS } from "@/entities/review";
import { getReviewDetail, getReviewTitle } from "@/entities/review/server";
import { parseSort, stringParams } from "@/shared/lib";
import { requireStaff } from "@/shared/server";
import { ReviewDetailMobileView, ReviewDetailView } from "@/views/review-detail";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/reviews/[id]">): Promise<Metadata> {
  const title = await getReviewTitle((await params).id);
  return { title: title ?? "후기 상세" };
}

// 들어온 목록의 탭·검색·사진·구인 칩·정렬을 주소로 받아 뒤로 가기와 [다음 건]을 만든다.
export default async function ReviewDetailPage({
  params,
  searchParams,
}: PageProps<"/[server]/reviews/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { tab, q, photo, game, sort, dir, page, pageSize } = stringParams(query);
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
  const listQuery = { q, photo, game, sort, dir, page, pageSize };
  // 조치 모달은 데스크톱 화면이 띄우고, 모바일에선 같은 모달이 시트로 열린다.
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <ReviewDetailView review={review} tab={listTab} listQuery={listQuery} viewerId={staff.id} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <ReviewDetailMobileView review={review} tab={listTab} listQuery={listQuery} />
      </div>
    </>
  );
}
