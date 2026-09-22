import type { Metadata } from "next";

import { DrawResultView } from "@/views/draw-result";

export const metadata: Metadata = { title: "추첨 결과" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DrawResultView id={id} />;
}
