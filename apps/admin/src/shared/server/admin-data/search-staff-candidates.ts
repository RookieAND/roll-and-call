import "server-only";
import { listStaff } from "./list-staff";
import { pickStaffCandidates } from "./pick-staff-candidates";
import { loadSnapshot } from "./snapshot";

export async function searchStaffCandidates(query: string) {
  const [db, staff] = await Promise.all([loadSnapshot(), listStaff()]);
  const staffIds = new Set(staff.map((member) => member.userId));
  return pickStaffCandidates({ users: db.users, staffIds, query });
}
