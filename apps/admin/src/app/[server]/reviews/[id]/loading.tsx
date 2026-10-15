import { ReviewDetailLoading, ReviewDetailMobileLoading } from "@/views/review-detail";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <ReviewDetailLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <ReviewDetailMobileLoading />
      </div>
    </>
  );
}
