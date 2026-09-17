import { HomeView } from "@/views/home";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ auth_error?: string; date?: string }>;
}) {
  const { auth_error: authError, date } = await searchParams;
  return <HomeView date={date} authError={authError === "1"} />;
}
