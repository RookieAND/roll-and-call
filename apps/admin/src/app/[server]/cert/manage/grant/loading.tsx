import { CertGrantLoading, CertGrantMobileLoading } from "@/views/cert-grant";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <CertGrantLoading />
      </div>
      <div className="contents lg:hidden">
        <CertGrantMobileLoading />
      </div>
    </>
  );
}
