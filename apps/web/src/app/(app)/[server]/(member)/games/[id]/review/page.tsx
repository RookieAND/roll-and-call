import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { WriteReviewView } from "@/views/write-review";

export const metadata: Metadata = { title: "후기 쓰기" };
export default async function Page({
  params,
  searchParams,
}: PageProps<"/[server]/games/[id]/review">) {
  await requireMembership();
  const [{ id }, { round }] = await Promise.all([params, searchParams]);
  const roundNo = isString(round) && Number.isInteger(Number(round)) ? Number(round) : undefined;
  return <WriteReviewView gameId={id} roundNo={roundNo} />;
}
