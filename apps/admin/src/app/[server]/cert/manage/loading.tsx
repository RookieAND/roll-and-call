import { CertManageLoading, CertManageMobileLoading } from "@/views/cert-manage";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <CertManageLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <CertManageMobileLoading />
      </div>
    </>
  );
}
