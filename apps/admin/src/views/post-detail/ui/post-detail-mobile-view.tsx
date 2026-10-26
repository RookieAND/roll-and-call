import { Button, Callout, VStack } from "@roll-and-call/ui";

import { auditLogHref } from "@/entities/audit";
import type { PostDetail } from "@/entities/post/server";
import { POST_ACTION, type PostAction } from "@/features/moderate-post";
import { formatFullDateTime, sessionTimeLabel, withQuery } from "@/shared/lib";
import {
  AdminHeader,
  KeyValueList,
  MobileDetailBar,
  MobileSection,
  MobileTitle,
  ServerLink,
  StatusBadges,
} from "@/shared/ui";

import { POST_DETAIL_TAB } from "../model/post-detail-tab";
import { PostMobileTabs } from "./mobile/post-mobile-tabs";
import { PostTabBody } from "./mobile/post-tab-body";

interface PostDetailMobileViewProps {
  post: PostDetail;
  tab: string | undefined;
  listQuery: Record<string, string | undefined>;
  serverAppUrl: string | undefined;
}

// 조치 시트(?action=)와 신청글 시트(?note=)는 데스크톱 화면이 띄우는 ResponsiveDialog를 같이 쓴다.
export function PostDetailMobileView({
  post,
  tab,
  listQuery,
  serverAppUrl,
}: PostDetailMobileViewProps) {
  const pathname = `/posts/${post.id}`;
  const currentTab =
    Object.values(POST_DETAIL_TAB).find((candidate) => candidate === tab) ??
    POST_DETAIL_TAB.content;
  const query = { ...listQuery, tab: tab ? currentTab : undefined };
  const listHref = withQuery("/posts", listQuery, {});
  const actionHref = (action: PostAction) => withQuery(pathname, query, { action });
  const noteHref = post.applicationNoteEnabled
    ? (userId: string) => withQuery(pathname, query, { note: userId })
    : undefined;
  const userAppHref = serverAppUrl ? `${serverAppUrl}/games/${post.id}` : null;
  const cancelShown = !post.cancelled && post.cancellable;

  const primary = post.hidden ? (
    <Button render={<ServerLink path={actionHref(POST_ACTION.unhide)} scroll={false} />}>
      숨김 해제
    </Button>
  ) : (
    <Button
      variant="outline"
      colorPalette="gray"
      render={<ServerLink path={actionHref(POST_ACTION.hide)} scroll={false} />}
    >
      구인 숨기기
    </Button>
  );
  const moreItems = (
    <>
      {userAppHref ? (
        <Button
          variant="outline"
          colorPalette="gray"
          render={<a href={userAppHref} target="_blank" rel="noreferrer" />}
        >
          사용자 화면으로 보기
        </Button>
      ) : null}
      <Button
        variant="outline"
        colorPalette="gray"
        render={<ServerLink path={`/users/${post.gm.id}`} />}
      >
        GM 유저 상세 열기
      </Button>
      <Button
        variant="outline"
        colorPalette="gray"
        render={<ServerLink path={`/reviews?game=${post.id}`} />}
      >
        후기 목록에서 보기
      </Button>
      <Button
        variant="outline"
        colorPalette="gray"
        render={<ServerLink path={auditLogHref({ targetGameId: post.id })} />}
      >
        활동 기록에서 보기
      </Button>
      {cancelShown ? (
        <Button
          variant="outline"
          colorPalette="danger"
          disabled={post.sessionStarted}
          render={
            post.sessionStarted ? undefined : (
              <ServerLink path={actionHref(POST_ACTION.remove)} scroll={false} />
            )
          }
        >
          구인 취소
        </Button>
      ) : null}
    </>
  );

  return (
    <>
      <AdminHeader
        title={<MobileTitle title={post.title} sub="구인 상세" />}
        trail={[{ href: listHref, label: "구인" }]}
      />
      <VStack gap="150" className="px-150 pt-150 pb-150">
        {post.hidden ? (
          <Callout.Root colorPalette="warning">
            <Callout.Icon />
            <Callout.Title>숨김 중인 구인입니다</Callout.Title>
            <Callout.Description>
              {formatFullDateTime(post.hidden.at)}에 {post.hidden.by}님이 숨겼습니다. 사유:{" "}
              {post.hidden.reason}
            </Callout.Description>
          </Callout.Root>
        ) : null}
        <MobileSection flush>
          <KeyValueList
            items={[
              { label: "GM", value: post.gm.nickname },
              { label: "룰북", value: post.rulebook },
              { label: "세션 일시", value: sessionTimeLabel(post.sessionAt) },
              { label: "플레이타임", value: post.playTime ?? "—" },
              { label: "참여", value: `${post.memberCount}/${post.capacity}명` },
              {
                label: "상태",
                value: (
                  <StatusBadges status={post.isPrivate ? `${post.status} · 비공개` : post.status} />
                ),
              },
            ]}
          />
        </MobileSection>
      </VStack>
      <PostMobileTabs
        tab={currentTab}
        memberCount={post.members.length}
        waitlistCount={post.waitlist.length}
      >
        <PostTabBody post={post} tab={currentTab} noteHref={noteHref} />
      </PostMobileTabs>
      <MobileDetailBar primary={primary} more={{ title: post.title, items: moreItems }} />
    </>
  );
}
