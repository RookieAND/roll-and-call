import { GamesView } from "@/views/games";

// Live recruiting board — read at request time, never prerendered.
export const dynamic = "force-dynamic";

export default function Page() {
  return <GamesView />;
}
