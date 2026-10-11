import type { GameKind, PlayType } from "@roll-and-call/database/games/model";
import { renameDiscordThread, updateForumThread } from "@roll-and-call/discord";

import { recruitStatusTagIds } from "./recruit-status-tag-ids";
import type { RecruitTarget } from "./recruit-target";

// 모집 글 스레드의 이름과 상태 태그를 맞춘다. 포럼이면 한 요청으로 보내고, 텍스트 채널이면 이름만 바꾼다.
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
  if (!target.forum) {
    await renameDiscordThread({ threadId, name });
    return;
  }
  await updateForumThread({
    threadId,
    name,
    managedTagIds: target.tags.managed,
    skipLocked,
    tagIds: recruitStatusTagIds({ target, closed, cancelled, categoryId, kind, playType }),
  });
}
