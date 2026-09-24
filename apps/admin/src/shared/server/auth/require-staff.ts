import "server-only";
import { getCurrentStaff } from "./get-current-staff";

// 서버 액션 입구. 화면 가드와 별개로 액션마다 다시 확인한다.
export async function requireStaff() {
  const staff = await getCurrentStaff();
  if (staff.status !== "staff") throw new Error("운영진만 이용할 수 있습니다");
  return staff;
}
