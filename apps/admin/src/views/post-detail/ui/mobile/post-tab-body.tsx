import type { PostDetail } from "@/entities/post/server";

import type { AdminRoundsView } from "../../model/admin-rounds";
import { POST_DETAIL_TAB, type PostDetailTab } from "../../model/post-detail-tab";
import { PostContentMobile } from "./post-content-mobile";
import { PostMembersMobile } from "./post-members-mobile";

interface PostTabBodyProps {
  post: PostDetail;
  tab: PostDetailTab;
  noteHref: ((userId: string) => string) | undefined;
  rounds: AdminRoundsView | null;
}

export function PostTabBody({ post, tab, noteHref, rounds }: PostTabBodyProps) {
  if (tab === POST_DETAIL_TAB.members) {
    return <PostMembersMobile members={post.members} gmId={post.gm.id} noteHref={noteHref} />;
  }
  if (tab === POST_DETAIL_TAB.waitlist) {
    return (
      <PostMembersMobile members={post.waitlist} gmId={post.gm.id} waiting noteHref={noteHref} />
    );
  }
  return <PostContentMobile post={post} rounds={rounds} />;
}
