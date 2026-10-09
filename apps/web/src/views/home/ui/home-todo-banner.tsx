import { HStack, Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { Bell, ChevronRight, CircleAlert } from "lucide-react";

import { ServerLink } from "@/shared/ui";
import { type TodoList } from "@/widgets/session-list";
import { loadTodos } from "@/widgets/session-list/server";

const banner = cva("min-h-11 border-b border-gray-200 px-200 text-gray-900", {
  variants: { blocked: { true: "bg-danger-50", false: "bg-tinted-bg" } },
});

interface HomeTodoBannerProps {
  serverId: string;
  userId: string;
}

// 수는 알림 탭 [할 일]과 같다. 받은 알림은 세지 않는다. 못 불러오면 배너 없이 달력이 맨 위에 온다.
export async function HomeTodoBanner({ serverId, userId }: HomeTodoBannerProps) {
  const todos: TodoList | null = await loadTodos(serverId, userId).catch(() => null);
  if (!todos || todos.count === 0) return null;
  const Icon = todos.blocked ? CircleAlert : Bell;
  const iconForeground = todos.blocked ? "danger" : "primary";

  return (
    <HStack
      align="center"
      gap="100"
      render={<ServerLink path="/notifications?tab=todo" />}
      className={banner({ blocked: todos.blocked })}
    >
      <Text foreground={iconForeground} className="flex">
        <Icon size={18} strokeWidth={2.1} aria-hidden />
      </Text>
      <Text typography="body3" className="min-w-0 flex-1">
        할 일이{" "}
        <Text render={<strong />} typography="body3" weight="extrabold">
          {todos.count}개
        </Text>{" "}
        남았습니다.
      </Text>
      <HStack align="center" gap="025">
        <Text typography="body3" weight="bold" foreground="primary">
          보기
        </Text>
        <Text foreground="primary" className="flex">
          <ChevronRight size={14} strokeWidth={2.4} aria-hidden />
        </Text>
      </HStack>
    </HStack>
  );
}
