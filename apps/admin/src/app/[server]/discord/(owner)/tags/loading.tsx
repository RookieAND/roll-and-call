import { DiscordMobileLoading, ForumTagsLoading } from "@/views/discord";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <ForumTagsLoading />
      </div>
      <div className="contents lg:hidden">
        <DiscordMobileLoading active="/discord/tags" />
      </div>
    </>
  );
}
