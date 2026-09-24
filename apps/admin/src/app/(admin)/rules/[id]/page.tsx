import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRulebookDetail } from "@/shared/server";
import { RulebookDetailView } from "@/views/rulebook-detail";

export async function generateMetadata({ params }: PageProps<"/rules/[id]">): Promise<Metadata> {
  const rulebook = await getRulebookDetail((await params).id);
  return { title: rulebook ? `${rulebook.label} 룰북 상세` : "룰북 상세" };
}

export default async function RulebookDetailPage({ params }: PageProps<"/rules/[id]">) {
  const rulebook = await getRulebookDetail((await params).id);
  if (!rulebook) notFound();
  return <RulebookDetailView rulebook={rulebook} />;
}
