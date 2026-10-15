import { NoShowsLoading, NoShowsMobileLoading } from "@/views/no-shows";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <NoShowsLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <NoShowsMobileLoading />
      </div>
    </>
  );
}
