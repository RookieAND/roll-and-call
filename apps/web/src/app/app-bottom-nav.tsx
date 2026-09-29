"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import { BottomNav } from "@/shared/ui";

import { fetchHasSessionTodo } from "./fetch-has-session-todo";

const TODO_STALE_MILLISECONDS = 30_000;

// ponytail: 화면마다 따로 캐시해 30초 안에 다시 오면 묻지 않는다. 할 일을 바꾸는 액션에서 무효화하면 더 정확해진다.
export function AppBottomNav() {
  const pathname = usePathname();
  const { data: hasTodo = false } = useQuery({
    queryKey: ["has-session-todo", pathname],
    queryFn: fetchHasSessionTodo,
    staleTime: TODO_STALE_MILLISECONDS,
    throwOnError: false,
  });
  return <BottomNav hasTodo={hasTodo} />;
}
