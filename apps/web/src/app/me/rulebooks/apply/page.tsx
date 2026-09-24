import type { Metadata } from "next";

import { RulebookApplyView } from "@/views/rulebook-apply";

export const metadata: Metadata = { title: "룰북 인증하기" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ rulebook?: string }>;
}) {
  const { rulebook } = await searchParams;
  return <RulebookApplyView rulebookId={rulebook ?? null} />;
}
