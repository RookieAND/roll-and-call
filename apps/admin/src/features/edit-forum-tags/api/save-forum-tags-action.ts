"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, requireOwner, saveForumTags } from "@/shared/server";

import type { ForumTagForm } from "../model/forum-tag-form";
import { toForumTagMap } from "../model/to-forum-tag-map";
import { loadForumTagOptions } from "./load-forum-tag-options";

type SaveForumTagsResult = { ok: true } | { ok: false };

// 포럼에 없는 태그 id가 섞여 있으면(그사이 지워짐) 저장하지 않고 화면을 다시 읽게 한다.
export async function saveForumTagsAction(form: ForumTagForm): Promise<SaveForumTagsResult> {
  const actor = await requireOwner();
  const server = await getCurrentServer();
  const options = await loadForumTagOptions(server.recruitChannelId);
  if (options.status !== "forum") return { ok: false };

  const map = toForumTagMap(form);
  const chosen = [map?.open, map?.closed, ...Object.values(map?.categories ?? {})];
  const known = options.tags.map((tag) => tag.id);
  if (chosen.some((id) => id && !known.includes(id))) return { ok: false };

  await saveForumTags({
    serverId: server.id,
    forumTags: map,
    actor,
    reason: "모집 포럼 태그 연결 변경",
  });
  revalidatePath("/", "layout");
  return { ok: true };
}
