import { HomeView } from "@/views/home";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ auth_error?: string }>;
}) {
  const { auth_error: authError } = await searchParams;
  return <HomeView authError={authError === "1"} />;
}
