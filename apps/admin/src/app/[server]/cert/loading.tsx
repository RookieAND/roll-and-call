import { CertQueueLoading, CertQueueMobileLoading } from "@/views/cert-queue";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <CertQueueLoading />
      </div>
      <div className="contents lg:hidden">
        <CertQueueMobileLoading />
      </div>
    </>
  );
}
