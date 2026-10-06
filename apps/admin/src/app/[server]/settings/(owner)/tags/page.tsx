import type { Metadata } from "next";

import { loadForumTagOptions } from "@/features/edit-forum-tags";
import { getCurrentServer, listRulebookCategories } from "@/shared/server";
import { ForumTagsView } from "@/views/settings";

export const metadata: Metadata = { title: "설정 · 포럼 태그" };

export default async function SettingsTagsPage() {
  const server = await getCurrentServer();
  const [options, categories] = await Promise.all([
    loadForumTagOptions(server.recruitChannelId),
    listRulebookCategories({ serverId: server.id }),
  ]);
  const saved = server.forumTags;
  return (
    <ForumTagsView
      options={options}
      categories={categories}
      saved={{
        open: saved?.open ?? "",
        closed: saved?.closed ?? "",
        cancelled: saved?.cancelled ?? "",
        categories: saved?.categories ?? {},
      }}
    />
  );
}
