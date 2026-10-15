import { DiscordMobileLoading, MessagesLoading } from "@/views/discord";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <MessagesLoading />
      </div>
      <div className="contents lg:hidden">
        <DiscordMobileLoading active="/discord/messages" />
      </div>
    </>
  );
}
