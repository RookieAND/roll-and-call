import { z } from "zod";

// 정원 상한 20명에 대기·불참까지 더해도 넘지 않을 값.
const ROSTER_USER_IDS_MAX = 40;

const rosterRequestSchema = z.object({
  gameId: z.uuid(),
  userIds: z.array(z.uuid()).max(ROSTER_USER_IDS_MAX),
});

// 서버 액션 인자는 클라이언트가 바꿔 보낼 수 있다. 모양이 틀린 id를 쿼리에 넘기면 캐스팅 오류(500)가 난다.
export function isRosterRequest(request: { gameId: unknown; userIds: unknown }): boolean {
  return rosterRequestSchema.safeParse(request).success;
}
