import type { Metadata } from "next";

import { CreateGameView } from "@/views/create-game";

export const metadata: Metadata = { title: "새 구인글" };
export default function Page() {
  return <CreateGameView />;
}
