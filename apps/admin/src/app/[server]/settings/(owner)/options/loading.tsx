import { ServerOptionsLoading, SettingsMobileLoading } from "@/views/settings";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <ServerOptionsLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <SettingsMobileLoading active="/settings/options" />
      </div>
    </>
  );
}
