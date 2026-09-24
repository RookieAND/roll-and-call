import type { Metadata } from "next";

import { listStaff, requireStaff, searchStaffCandidates } from "@/shared/server";
import { SettingsStaffView } from "@/views/settings";

export const metadata: Metadata = { title: "설정 · 운영진 관리" };

export default async function SettingsStaffPage({ searchParams }: PageProps<"/settings/staff">) {
  const [query, viewer, staff] = await Promise.all([
    searchParams as Promise<Record<string, string | undefined>>,
    requireStaff(),
    listStaff(),
  ]);
  const candidates = query.action === "add" ? await searchStaffCandidates(query.q ?? "") : [];
  const removing = staff.find(
    (member) => member.nickname === query.staff && member.role !== "owner",
  );
  return (
    <SettingsStaffView
      staff={staff}
      viewer={viewer.nickname}
      candidates={candidates}
      removing={removing}
      page={query.page}
    />
  );
}
