import { SettingsStaffLoading, SettingsMobileLoading } from "@/views/settings";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <SettingsStaffLoading />
      </div>
      <div className="contents lg:hidden">
        <SettingsMobileLoading active="/settings/staff" />
      </div>
    </>
  );
}
