import type { Metadata } from "next";

import { searchStaffCandidates } from "@/entities/staff/server";
import { stringParams } from "@/shared/lib";
import { listStaff, requireStaff } from "@/shared/server";
import { SettingsStaffMobileView, SettingsStaffView } from "@/views/settings";

export const metadata: Metadata = { title: "설정 · 운영진 관리" };

export default async function SettingsStaffPage({
  searchParams,
}: PageProps<"/[server]/settings/staff">) {
  const [query, viewer, staff] = await Promise.all([
    searchParams.then(stringParams),
    requireStaff(),
    listStaff(),
  ]);
  const candidates = query.action === "add" ? await searchStaffCandidates(query.q ?? "") : [];
  const removing = staff.find((member) => member.userId === query.staff && member.role !== "owner");
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <SettingsStaffView
          staff={staff}
          viewerId={viewer.id}
          candidates={candidates}
          removing={removing}
        />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <SettingsStaffMobileView staff={staff} viewerId={viewer.id} />
      </div>
    </>
  );
}
