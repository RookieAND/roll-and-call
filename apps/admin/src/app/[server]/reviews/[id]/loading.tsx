import { ReviewDetailLoading, ReviewDetailMobileLoading } from "@/views/review-detail";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <ReviewDetailLoading />
      </div>
      <div className="contents lg:hidden">
        <ReviewDetailMobileLoading />
      </div>
    </>
  );
}
