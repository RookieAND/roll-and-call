import { AuditEntryLoading, AuditEntryMobileLoading } from "@/views/audit-entry";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <AuditEntryLoading />
      </div>
      <div className="contents lg:hidden">
        <AuditEntryMobileLoading />
      </div>
    </>
  );
}
