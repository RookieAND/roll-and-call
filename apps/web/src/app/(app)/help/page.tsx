import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { HelpListView } from "@/views/help";

export const metadata: Metadata = { title: "도움말" };

export default async function Page({ searchParams }: PageProps<"/help">) {
  const { from } = await searchParams;
  return <HelpListView from={isString(from) ? from : null} />;
}
