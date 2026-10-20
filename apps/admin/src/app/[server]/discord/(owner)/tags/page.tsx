import type { Metadata } from "next";

import { loadForumTagOptions, saveForumTagsAction } from "@/features/edit-forum-tags";
import { getCurrentServer, listRulebookCategories } from "@/shared/server";
import { ForumTagsMobileView, ForumTagsView } from "@/views/discord";

export const metadata: Metadata = { title: "Discord · 포럼 태그" };

export default async function DiscordTagsPage() {
  const server = await getCurrentServer();
  const [options, categories] = await Promise.all([
    loadForumTagOptions(server.recruitChannelId),
    listRulebookCategories({ serverId: server.id }),
  ]);
  const saved = server.forumTags;
  const props = {
    onSave: saveForumTagsAction,
    options,
    categories,
    saved: {
      open: saved?.open ?? "",
      closed: saved?.closed ?? "",
      cancelled: saved?.cancelled ?? "",
      categories: saved?.categories ?? {},
      playTypes: { voice: saved?.playTypes?.voice ?? "", text: saved?.playTypes?.text ?? "" },
      adult: saved?.adult ?? "",
      briefing: saved?.briefing ?? "",
      session: saved?.session ?? "",
    },
  };
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <ForumTagsView {...props} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <ForumTagsMobileView {...props} />
      </div>
    </>
  );
}
