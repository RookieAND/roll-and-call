import { AuditLogLoading, AuditLogMobileLoading } from "@/views/audit-log";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <AuditLogLoading />
      </div>
      <div className="contents lg:hidden">
        <AuditLogMobileLoading />
      </div>
    </>
  );
}
