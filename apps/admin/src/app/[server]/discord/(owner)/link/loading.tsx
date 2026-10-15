import { DiscordSettingsMobileLoading, DiscordSettingsLoading } from "@/views/discord";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <DiscordSettingsLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <DiscordSettingsMobileLoading />
      </div>
    </>
  );
}
