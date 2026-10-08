import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { RulebookRequestView } from "@/views/rulebook-apply";

export const metadata: Metadata = { title: "룰북 추가 요청" };
export default async function Page({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  await requireMembership();
  const { name } = await searchParams;
  return <RulebookRequestView query={name ?? ""} />;
}
