import { HStack, VStack } from "@roll-and-call/ui";

import { POST_ACTION, PostActionDialog, type PostAction } from "@/features/moderate-post";
import { auditLogHref, withQuery } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { AdminHeader, HiddenBanner, NextItemButton, Panel, Tag } from "@/shared/ui";

import { POST_DETAIL_TAB, type PostDetailTab } from "../model/post-detail-tab";
import { ContentPanel } from "./content-panel";
import { MemberPanel } from "./member-panel";
import { PostActionsAside } from "./post-actions-aside";
import { PostDetailTabs } from "./post-detail-tabs";
import { PostSummary } from "./post-summary";

interface PostDetailViewProps {
  post: PostDetail;
  tab: string | undefined;
  // 들어온 목록의 검색·필터·정렬·쪽(q, status, rulebook, sort, dir, page).
  listQuery: Record<string, string | undefined>;
  // 사용자 앱에서 이 서버 화면의 주소(…/{slug}).
  serverAppUrl: string | undefined;
  viewerId: string;
}

export function PostDetailView({
  post,
  tab,
  listQuery,
  serverAppUrl,
  viewerId,
}: PostDetailViewProps) {
  const pathname = `/posts/${post.id}`;
  const cancelOpen = !post.cancelled && post.cancellable && !post.sessionStarted;
  const availableActions: PostAction[] = [
    post.hidden ? POST_ACTION.unhide : POST_ACTION.hide,
    ...(cancelOpen ? [POST_ACTION.remove] : []),
  ];
  const availableTabs: PostDetailTab[] = Object.values(POST_DETAIL_TAB);
  const currentTab =
    availableTabs.find((candidate) => candidate === tab) ?? POST_DETAIL_TAB.content;
  const query = { ...listQuery, tab: tab ? currentTab : undefined };
  const listHref = withQuery("/posts", listQuery, {});
  const nextHref = post.next
    ? withQuery(`/posts/${post.next.id}`, listQuery, {
        page: post.next.page > 1 ? String(post.next.page) : undefined,
      })
    : undefined;
  const logHref = auditLogHref({ targetGameId: post.id });
  const userAppHref = serverAppUrl ? `${serverAppUrl}/games/${post.id}` : null;
  const actionHref = (nextAction: PostAction) => withQuery(pathname, query, { action: nextAction });

  return (
    <>
      <AdminHeader
        title={
          <HStack align="center" gap="100" render={<span />}>
            {post.title}
            <Tag>{post.status}</Tag>
          </HStack>
        }
        sub={post.hidden ? "숨김 중" : "구인 상세"}
        trail={[{ href: listHref, label: "구인" }]}
        actions={<NextItemButton href={nextHref} />}
        withAside
      />
      <HStack data-full-bleed align="stretch" className="flex-1">
        <VStack gap="150" className="min-w-0 flex-1 px-center-200 py-200">
          {post.hidden ? <HiddenBanner hidden={post.hidden} /> : null}
          <PostSummary post={post} userAppHref={userAppHref} logHref={logHref} />
          <Panel>
            <PostDetailTabs
              tab={currentTab}
              memberCount={post.members.length}
              waitlistCount={post.waitlist.length}
              contentPanel={<ContentPanel post={post} />}
              memberPanel={<MemberPanel members={post.members} />}
              waitlistPanel={<MemberPanel members={post.waitlist} waiting />}
            />
          </Panel>
        </VStack>
        <PostActionsAside post={post} actionHref={actionHref} />
      </HStack>
      <PostActionDialog
        post={post}
        availableActions={availableActions}
        closeHref={withQuery(pathname, query, {})}
        viewerId={viewerId}
      />
    </>
  );
}
