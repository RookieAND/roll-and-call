"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import { BottomNav } from "@/shared/ui";

// ponytail: 화면을 옮길 때마다 다시 센다. 요청이 부담되면 staleTime을 주거나 할 일을 바꾸는 액션에서 무효화한다.
interface AppBottomNavProps {
  loadHasTodo: () => Promise<boolean>;
}

export function AppBottomNav({ loadHasTodo }: AppBottomNavProps) {
  const pathname = usePathname();
  const { data: hasTodo = false } = useQuery({
    queryKey: ["has-session-todo", pathname],
    queryFn: () => loadHasTodo(),
    throwOnError: false,
  });
  return <BottomNav hasTodo={hasTodo} />;
}
