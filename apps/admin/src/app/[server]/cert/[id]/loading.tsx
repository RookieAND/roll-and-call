import { CertReviewLoading, CertReviewMobileLoading } from "@/views/cert-review";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <CertReviewLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <CertReviewMobileLoading />
      </div>
    </>
  );
}
