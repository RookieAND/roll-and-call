import { Callout, HStack, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { Hourglass } from "lucide-react";

import { POST_ACTION, PostActionDialog, type PostAction } from "@/features/moderate-post";
import { paginate, withQuery } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { AdminHeader, ListPager, Panel } from "@/shared/ui";

import { POST_DETAIL_TAB, type PostDetailTab } from "../model/post-detail-tab";
import { summaryRows } from "../model/summary-rows";
import { ContentPanel } from "./content-panel";
import { HiddenBanner } from "./hidden-banner";
import { MemberPanel } from "./member-panel";
import { PostActionsAside } from "./post-actions-aside";
import { PostDetailTabs } from "./post-detail-tabs";
import { PostReviewsAside } from "./post-reviews-aside";
import { PostSummary } from "./post-summary";
import { ReportPanel } from "./report-panel";
import { ReviewPanel } from "./review-panel";

interface PostDetailViewProps {
  post: PostDetail;
  tab: string | undefined;
  action: string | undefined;
  // 사용자 앱에서 이 서버 화면의 주소(…/{slug}).
  serverAppUrl: string | undefined;
  page?: string;
}

export function PostDetailView({ post, tab, action, page, serverAppUrl }: PostDetailViewProps) {
  const pathname = `/posts/${post.id}`;
  const hasReports = post.reports.length > 0;
  const availableActions: PostAction[] = [
    post.hidden ? POST_ACTION.unhide : POST_ACTION.hide,
    ...(post.unresolvedReportCount > 0 ? [POST_ACTION.resolve] : []),
    POST_ACTION.remove,
  ];
  const availableTabs: PostDetailTab[] = [
    ...(hasReports ? [POST_DETAIL_TAB.reports] : []),
    POST_DETAIL_TAB.content,
    POST_DETAIL_TAB.members,
    POST_DETAIL_TAB.waitlist,
    POST_DETAIL_TAB.reviews,
  ];
  const defaultTab =
    post.unresolvedReportCount > 0 ? POST_DETAIL_TAB.reports : POST_DETAIL_TAB.content;
  const currentTab = availableTabs.find((candidate) => candidate === tab) ?? defaultTab;
  const openAction = availableActions.find((candidate) => candidate === action) ?? null;
  const query = { tab: tab ? currentTab : undefined, page };
  const pagedMembers = paginate(post.members, page);
  const pagedWaitlist = paginate(post.waitlist, page);
  const pagedTabs: Partial<
    Record<PostDetailTab, { paged: { page: number; totalPages: number }; total: number }>
  > = {
    [POST_DETAIL_TAB.members]: { paged: pagedMembers, total: post.members.length },
    [POST_DETAIL_TAB.waitlist]: { paged: pagedWaitlist, total: post.waitlist.length },
  };
  const pagedTab = pagedTabs[currentTab] ?? null;
  const pager = pagedTab ? (
    <ListPager
      page={pagedTab.paged.page}
      totalPages={pagedTab.paged.totalPages}
      total={pagedTab.total}
      unit="명"
    />
  ) : null;
  const logHref = `/log?target=${encodeURIComponent(post.title)}`;
  const userAppHref = serverAppUrl ? `${serverAppUrl}/games/${post.id}` : null;
  const reviewsTab = currentTab === POST_DETAIL_TAB.reviews;
  const actionHref = (nextAction: PostAction) => withQuery(pathname, query, { action: nextAction });
  const attendanceWaitDays =
    reviewsTab && !post.attendance.confirmedAt
      ? Math.floor((Date.now() - post.startsAt.getTime()) / 86_400_000)
      : null;

  return (
    <>
      <AdminHeader
        title={post.title}
        sub={post.hidden ? "숨김 중" : "구인 상세"}
        trail={[{ href: "/posts", label: "구인 목록" }]}
        withAside
      />
      <HStack data-full-bleed align="stretch" className="flex-1">
        <VStack gap="150" className="min-w-0 flex-1 px-center-200 py-200">
          {post.hidden ? <HiddenBanner hidden={post.hidden} logHref={logHref} /> : null}
          {!isNull(attendanceWaitDays) && attendanceWaitDays > 0 ? (
            <Callout.Root colorPalette="warning" size="sm">
              <Callout.Icon>
                <Hourglass size={14} />
              </Callout.Icon>
              <Callout.Description>
                세션 시작 {attendanceWaitDays}일째입니다. GM의 출석 확인을 기다리고 있습니다.
              </Callout.Description>
            </Callout.Root>
          ) : null}
          <PostSummary
            post={post}
            rows={summaryRows({ post, reviewsTab })}
            userAppHref={userAppHref}
            logHref={logHref}
            removeHref={actionHref(POST_ACTION.remove)}
          />
          <Panel className="flex-1" footer={pager}>
            <PostDetailTabs
              tab={currentTab}
              unresolvedReportCount={post.unresolvedReportCount}
              memberCount={post.members.length}
              waitlistCount={post.waitlist.length}
              reviewCount={post.reviews.length}
              reviewReported={post.reviews.some((review) => review.openReportCount > 0)}
              reportPanel={hasReports ? <ReportPanel reports={post.reports} /> : null}
              contentPanel={<ContentPanel post={post} />}
              memberPanel={<MemberPanel members={pagedMembers.rows} />}
              waitlistPanel={<MemberPanel members={pagedWaitlist.rows} waiting />}
              reviewPanel={<ReviewPanel post={post} />}
            />
          </Panel>
        </VStack>
        {reviewsTab ? (
          <PostReviewsAside post={post} />
        ) : (
          <PostActionsAside post={post} actionHref={actionHref} />
        )}
      </HStack>
      <PostActionDialog
        post={post}
        action={openAction}
        closeHref={withQuery(pathname, query, {})}
      />
    </>
  );
}
