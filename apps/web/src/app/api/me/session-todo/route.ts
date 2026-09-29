import { hasSessionTodo } from "@/widgets/session-list";

// 하단 탭 빨간 점. 서버 액션은 한 번에 하나씩 줄 서서 사용자의 변경 요청을 막으므로 GET으로 읽는다.
export async function GET() {
  return Response.json({ hasTodo: await hasSessionTodo() });
}
