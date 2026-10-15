import { ServerSettingsLoading, SettingsMobileLoading } from "@/views/settings";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <ServerSettingsLoading />
      </div>
      <div className="contents lg:hidden">
        <SettingsMobileLoading active="/settings/server" />
      </div>
    </>
  );
}
