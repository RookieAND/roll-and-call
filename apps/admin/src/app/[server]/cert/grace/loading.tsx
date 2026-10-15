import { CertGraceLoading, CertGraceMobileLoading } from "@/views/cert-grace";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <CertGraceLoading />
      </div>
      <div className="contents lg:hidden">
        <CertGraceMobileLoading />
      </div>
    </>
  );
}
