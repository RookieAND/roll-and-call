import "server-only";
import { forbidden } from "next/navigation";

import { getCurrentStaff } from "./get-current-staff";

// 화면 가드와 별개로 서버 액션 첫 줄에서 다시 확인한다. 지금 서버(주소의 slug)의 역할만 본다.
export async function requireStaff() {
  const staff = await getCurrentStaff();
  if (staff.status !== "staff") forbidden();
  return staff;
}

export async function requireOwner() {
  const staff = await requireStaff();
  if (staff.role !== "owner") forbidden();
  return staff;
}
