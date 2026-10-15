import { CertGrantLoading, CertGrantMobileLoading } from "@/views/cert-grant";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <CertGrantLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <CertGrantMobileLoading />
      </div>
    </>
  );
}
