import { ReviewListLoading, ReviewListMobileLoading } from "@/views/review-list";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <ReviewListLoading />
      </div>
      <div className="contents lg:hidden">
        <ReviewListMobileLoading />
      </div>
    </>
  );
}
