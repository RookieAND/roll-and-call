import type { Metadata } from "next";

import { EditAvailabilityView } from "@/views/edit-availability";

export const metadata: Metadata = { title: "가능 시간대" };
export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;
  return <EditAvailabilityView from={from} />;
}
