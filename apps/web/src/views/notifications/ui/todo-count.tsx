import { TabCount } from "@/shared/ui";
import { loadTodos } from "@/widgets/session-list";

import { nullOnError } from "../api/null-on-error";

interface TodoCountProps {
  serverId: string;
  userId: string;
}

// 할 일을 못 불러왔으면 숫자를 비운다. loadTodos는 요청마다 한 번만 계산한다(react cache).
export async function TodoCount({ serverId, userId }: TodoCountProps) {
  const list = await nullOnError(loadTodos(serverId, userId));
  return <TabCount count={list?.count} />;
}
