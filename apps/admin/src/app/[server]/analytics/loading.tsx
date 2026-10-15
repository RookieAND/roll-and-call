import { AnalyticsLoading, AnalyticsMobileLoading } from "@/views/analytics";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <AnalyticsLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <AnalyticsMobileLoading />
      </div>
    </>
  );
}
