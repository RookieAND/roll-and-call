import "server-only";
import { listStaff, loadSnapshot } from "@/shared/server";

import { pickStaffCandidates } from "../model/pick-staff-candidates";

export async function searchStaffCandidates(query: string) {
  const [db, staff] = await Promise.all([loadSnapshot(), listStaff()]);
  const staffIds = new Set(staff.map((member) => member.userId));
  return pickStaffCandidates({ users: db.users, staffIds, query });
}
