import { DiscordMobileLoading, MessagesLoading } from "@/views/discord";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <MessagesLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <DiscordMobileLoading active="/discord/messages" />
      </div>
    </>
  );
}
