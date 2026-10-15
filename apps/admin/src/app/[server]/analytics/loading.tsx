import { AnalyticsLoading, AnalyticsMobileLoading } from "@/views/analytics";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <AnalyticsLoading />
      </div>
      <div className="contents lg:hidden">
        <AnalyticsMobileLoading />
      </div>
    </>
  );
}
