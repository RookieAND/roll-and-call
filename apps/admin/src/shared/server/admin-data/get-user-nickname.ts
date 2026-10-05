import "server-only";
import { loadSnapshot } from "./snapshot";

export async function getUserNickname(id: string) {
  const db = await loadSnapshot();
  return db.users.find((user) => user.id === id)?.nickname;
}
