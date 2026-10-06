import { setForumPostTags } from "@roll-and-call/discord";

import { recruitStatusTagIds } from "./recruit-status-tag-ids";
import type { RecruitTarget } from "./recruit-target";

export async function syncRecruitStatusTag({
  target,
  threadId,
  closed,
  categoryId,
}: {
  target: RecruitTarget;
  threadId: string;
  closed: boolean;
  categoryId: string | null;
}) {
  if (!target.forum) return;
  await setForumPostTags({
    threadId,
    managedTagIds: target.tags.managed,
    tagIds: recruitStatusTagIds({ target, closed, categoryId }),
  });
}
