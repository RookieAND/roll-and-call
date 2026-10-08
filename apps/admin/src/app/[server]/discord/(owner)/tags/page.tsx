import type { Metadata } from "next";

import { loadForumTagOptions, saveForumTagsAction } from "@/features/edit-forum-tags";
import { getCurrentServer, listRulebookCategories } from "@/shared/server";
import { ForumTagsView } from "@/views/discord";

export const metadata: Metadata = { title: "Discord · 포럼 태그" };

export default async function DiscordTagsPage() {
  const server = await getCurrentServer();
  const [options, categories] = await Promise.all([
    loadForumTagOptions(server.recruitChannelId),
    listRulebookCategories({ serverId: server.id }),
  ]);
  const saved = server.forumTags;
  return (
    <ForumTagsView
      onSave={saveForumTagsAction}
      options={options}
      categories={categories}
      saved={{
        open: saved?.open ?? "",
        closed: saved?.closed ?? "",
        cancelled: saved?.cancelled ?? "",
        categories: saved?.categories ?? {},
        playTypes: { voice: saved?.playTypes?.voice ?? "", text: saved?.playTypes?.text ?? "" },
        briefing: saved?.briefing ?? "",
      }}
    />
  );
}
