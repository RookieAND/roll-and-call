import { MySessionsView } from "@/views/my-sessions";
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; status?: string }>;
}) {
  const sp = await searchParams;
  return <MySessionsView tab={sp.tab} status={sp.status} />;
}
