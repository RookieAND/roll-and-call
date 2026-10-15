import { CertQueueLoading, CertQueueMobileLoading } from "@/views/cert-queue";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <CertQueueLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <CertQueueMobileLoading />
      </div>
    </>
  );
}
