import { CertManageLoading, CertManageMobileLoading } from "@/views/cert-manage";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <CertManageLoading />
      </div>
      <div className="contents lg:hidden">
        <CertManageMobileLoading />
      </div>
    </>
  );
}
