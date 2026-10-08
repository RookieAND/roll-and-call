import type { GameKind, PlayType } from "@roll-and-call/database/games/model";
import { setForumPostTags } from "@roll-and-call/discord";

import { recruitStatusTagIds } from "./recruit-status-tag-ids";
import type { RecruitTarget } from "./recruit-target";

export async function syncRecruitStatusTag({
  target,
  threadId,
  closed,
  cancelled,
  categoryId,
  kind,
  playType,
  skipLocked,
}: {
  target: RecruitTarget;
  threadId: string;
  closed: boolean;
  cancelled?: boolean;
  categoryId: string | null;
  kind: GameKind;
  playType: PlayType;
  skipLocked?: boolean;
}) {
  if (!target.forum) return;
  await setForumPostTags({
    threadId,
    managedTagIds: target.tags.managed,
    skipLocked,
    tagIds: recruitStatusTagIds({ target, closed, cancelled, categoryId, kind, playType }),
  });
}
