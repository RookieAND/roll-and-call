import type { Metadata } from "next";

import { HelpListView } from "@/views/help";

export const metadata: Metadata = { title: "도움말" };

export default function Page() {
  return <HelpListView />;
}
