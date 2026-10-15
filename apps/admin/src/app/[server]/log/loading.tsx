import { AuditLogLoading, AuditLogMobileLoading } from "@/views/audit-log";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <AuditLogLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <AuditLogMobileLoading />
      </div>
    </>
  );
}
