import { CertDetailMobileLoading } from "@/views/cert-manage";

export default function Loading() {
  return (
    <div data-view="mobile" className="contents lg:hidden">
      <CertDetailMobileLoading />
    </div>
  );
}
