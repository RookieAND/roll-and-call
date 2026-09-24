import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRulebookDetail, searchGrantCandidates } from "@/shared/server";
import { RulebookDetailView } from "@/views/rulebook-detail";

export async function generateMetadata({ params }: PageProps<"/rules/[id]">): Promise<Metadata> {
  const rulebook = await getRulebookDetail((await params).id);
  return { title: rulebook ? `${rulebook.label} 룰북 상세` : "룰북 상세" };
}

export default async function RulebookDetailPage({
  params,
  searchParams,
}: PageProps<"/rules/[id]">) {
  const [{ id }, { action, q }] = await Promise.all([params, searchParams]);
  const rulebook = await getRulebookDetail(id);
  if (!rulebook) notFound();
  const grantCandidates =
    action === "grant" && typeof q === "string" ? await searchGrantCandidates(id, q) : [];
  return <RulebookDetailView rulebook={rulebook} grantCandidates={grantCandidates} />;
}
