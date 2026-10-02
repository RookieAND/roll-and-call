"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import {
  deleteGameReviewForumPosts,
  evaluateGameBadges,
  getCurrentServer,
  moderatePost,
  requireStaff,
  type PostModeration,
} from "@/shared/server";

import { POST_ACTION } from "../model/post-action";
import { REQUIRED_FIELD } from "../model/required-field";

export async function submitPostModeration(postId: string, moderation: PostModeration) {
  const staff = await requireStaff();
  const requiredField = REQUIRED_FIELD[moderation.action];
  const input = {
    action: moderation.action,
    userReason: requiredField === "userReason" ? moderation.userReason.trim() : "",
    staffMemo: moderation.staffMemo.trim(),
  };
  if (requiredField && !input[requiredField]) throw new Error("필수 칸을 채워 주세요");
  const server = await getCurrentServer();
  const removing = input.action === POST_ACTION.remove;
  // 구인을 지우면 후기 행이 cascade로 사라져 포럼 스레드 id를 잃는다. 사용자 앱의 구인 삭제와 같은 순서다.
  // ponytail: 썸네일·본문 이미지 파일은 남는다. 어드민에 service-role 키가 생기면 지운다.
  if (removing) await deleteGameReviewForumPosts({ serverId: server.id, gameId: postId });
  const result = await moderatePost({
    serverId: server.id,
    id: postId,
    actor: staff,
    moderation: input,
  });
  revalidatePath("/", "layout");
  // 숨긴 구인은 인정 세션에서 빠지고, 되돌리면 다시 들어간다. 제거한 구인은 매일 밤 크론이 다시 맞춘다.
  if (!removing) after(() => evaluateGameBadges({ serverId: server.id, gameId: postId }));
  return result;
}
