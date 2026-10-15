import { AuditEntryLoading, AuditEntryMobileLoading } from "@/views/audit-entry";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <AuditEntryLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <AuditEntryMobileLoading />
      </div>
    </>
  );
}
