import { UserSessionsView } from "@/views/user-sessions";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ id }, { tab }] = await Promise.all([params, searchParams]);
  return <UserSessionsView id={id} tab={tab} />;
}
