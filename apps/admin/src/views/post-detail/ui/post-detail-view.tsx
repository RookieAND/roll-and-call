import { Callout, HStack, VStack } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import { POST_ACTION, PostActionDialog, type PostAction } from "@/features/moderate-post";
import { withQuery } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { AdminHeader, Panel } from "@/shared/ui";

import { POST_DETAIL_TAB, type PostDetailTab } from "../model/post-detail-tab";
import { ContentPanel } from "./content-panel";
import { HiddenBanner } from "./hidden-banner";
import { MemberPanel } from "./member-panel";
import { PostActionsAside } from "./post-actions-aside";
import { PostDetailTabs } from "./post-detail-tabs";
import { PostSummary } from "./post-summary";
import { ReportPanel } from "./report-panel";

interface PostDetailViewProps {
  post: PostDetail;
  tab: string | undefined;
  action: string | undefined;
  userAppUrl: string | undefined;
}

export function PostDetailView({ post, tab, action, userAppUrl }: PostDetailViewProps) {
  const pathname = `/posts/${post.id}`;
  const hasReports = post.reports.length > 0;
  const availableActions: PostAction[] = [
    POST_ACTION.edit,
    post.hidden ? POST_ACTION.unhide : POST_ACTION.hide,
    ...(post.unresolvedReportCount > 0 ? [POST_ACTION.resolve] : []),
  ];
  const availableTabs: PostDetailTab[] = [
    ...(hasReports ? [POST_DETAIL_TAB.reports] : []),
    POST_DETAIL_TAB.content,
    POST_DETAIL_TAB.members,
  ];
  const defaultTab =
    post.unresolvedReportCount > 0 ? POST_DETAIL_TAB.reports : POST_DETAIL_TAB.content;
  const currentTab = availableTabs.find((candidate) => candidate === tab) ?? defaultTab;
  const openAction = availableActions.find((candidate) => candidate === action) ?? null;
  const query = { tab: tab ? currentTab : undefined };
  const logHref = `/log?target=${encodeURIComponent(post.title)}`;
  const userAppHref = userAppUrl ? `${userAppUrl}/games/${post.id}` : null;
  const direct = !hasReports && !post.hidden;

  return (
    <>
      <AdminHeader
        title={post.title}
        sub={post.hidden ? "숨김 중" : "구인 상세"}
        back={{ href: "/posts", label: "구인 목록" }}
      />
      <HStack align="stretch" className="flex-1">
        <VStack gap="150" className="min-w-0 flex-1 p-200">
          {post.hidden ? <HiddenBanner hidden={post.hidden} logHref={logHref} /> : null}
          {direct ? (
            <Callout.Root colorPalette="gray" size="sm">
              <Callout.Icon>
                <Search size={14} />
              </Callout.Icon>
              <Callout.Description>
                신고 없이 직접 열어 본 구인입니다. 문제가 없으면 조치하지 않고 나가면 됩니다.
              </Callout.Description>
            </Callout.Root>
          ) : null}
          <PostSummary post={post} userAppHref={userAppHref} logHref={logHref} />
          <Panel className="flex-1">
            <PostDetailTabs
              tab={currentTab}
              unresolvedReportCount={post.unresolvedReportCount}
              memberLabel={`${post.memberCount} · 대기 ${post.waitingCount}`}
              reportPanel={hasReports ? <ReportPanel reports={post.reports} /> : null}
              contentPanel={<ContentPanel post={post} />}
              memberPanel={<MemberPanel members={post.members} />}
            />
          </Panel>
        </VStack>
        <PostActionsAside
          post={post}
          actionHref={(nextAction) => withQuery(pathname, query, { action: nextAction })}
        />
      </HStack>
      <PostActionDialog
        post={post}
        action={openAction}
        closeHref={withQuery(pathname, query, {})}
      />
    </>
  );
}
