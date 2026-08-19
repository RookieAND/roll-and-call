import { MySessionsView } from "@/views/my-sessions";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const sp = await searchParams;
  return <MySessionsView role="host" tab={sp.tab} />;
}
