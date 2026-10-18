import "server-only";
import { loadAdminData } from "@/shared/server";

export async function getUserNickname(id: string) {
  const db = await loadAdminData(["users"]);
  return db.users.find((user) => user.id === id)?.nickname;
}
