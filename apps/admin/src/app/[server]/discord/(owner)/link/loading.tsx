import { DiscordSettingsMobileLoading, DiscordSettingsLoading } from "@/views/discord";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <DiscordSettingsLoading />
      </div>
      <div className="contents lg:hidden">
        <DiscordSettingsMobileLoading />
      </div>
    </>
  );
}
