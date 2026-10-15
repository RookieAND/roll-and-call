import { ReviewListLoading, ReviewListMobileLoading } from "@/views/review-list";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <ReviewListLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <ReviewListMobileLoading />
      </div>
    </>
  );
}
