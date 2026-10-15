import { SettingsStaffLoading, SettingsMobileLoading } from "@/views/settings";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <SettingsStaffLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <SettingsMobileLoading active="/settings/staff" />
      </div>
    </>
  );
}
