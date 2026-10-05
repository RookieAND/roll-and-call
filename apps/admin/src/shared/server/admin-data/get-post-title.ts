import "server-only";
import { loadSnapshot } from "./snapshot";

// 탭 제목만 필요할 때 쓴다. 상세 전체를 계산하지 않는다.
export async function getPostTitle(id: string) {
  const db = await loadSnapshot();
  return db.sessions.find((session) => session.id === id)?.title;
}
