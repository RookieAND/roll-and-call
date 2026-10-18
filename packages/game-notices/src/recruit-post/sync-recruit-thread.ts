import type { GameKind, PlayType } from "@roll-and-call/database/games/model";
import { updateForumThread } from "@roll-and-call/discord";

import { recruitStatusTagIds } from "./recruit-status-tag-ids";
import type { RecruitTarget } from "./recruit-target";

// 모집 글 포럼 게시글의 이름과 상태 태그를 한 요청으로 맞춘다.
export async function syncRecruitThread({
  target,
  threadId,
  name,
  closed,
  cancelled,
  categoryId,
  kind,
  playType,
  skipLocked,
}: {
  target: RecruitTarget;
  threadId: string;
  name: string;
  closed: boolean;
  cancelled?: boolean;
  categoryId: string | null;
  kind: GameKind;
  playType: PlayType;
  skipLocked?: boolean;
}) {
  await updateForumThread({
    threadId,
    name,
    managedTagIds: target.tags.managed,
    skipLocked,
    tagIds: recruitStatusTagIds({ target, closed, cancelled, categoryId, kind, playType }),
  });
}
