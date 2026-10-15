import { CertReviewLoading, CertReviewMobileLoading } from "@/views/cert-review";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <CertReviewLoading />
      </div>
      <div className="contents lg:hidden">
        <CertReviewMobileLoading />
      </div>
    </>
  );
}
