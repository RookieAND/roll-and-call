"use client";

import { useParams } from "next/navigation";

import { AppBar } from "@/shared/ui";

// loading.tsx는 params를 받지 않아 주소에서 구인 id를 읽어 뒤로 갈 곳(구인 상세)을 정한다.
export function DrawResultAppBar() {
  const { id } = useParams<{ id: string }>();
  return <AppBar back={`/games/${id}`} title="추첨 결과" />;
}
