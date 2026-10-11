import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { RulebookBulkPhotosView, RulebookPhotosView } from "@/views/rulebook-apply";

export const metadata: Metadata = { title: "인증 신청" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ rulebook?: string | string[] }>;
}) {
  await requireMembership();
  const { rulebook } = await searchParams;
  const rulebookIds = [rulebook ?? []].flat();
  if (rulebookIds.length > 1) return <RulebookBulkPhotosView rulebookIds={rulebookIds} />;
  return <RulebookPhotosView rulebookId={rulebookIds[0] ?? ""} />;
}
