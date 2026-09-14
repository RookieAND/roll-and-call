import { HomeView } from "@/views/home";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ auth_error?: string }>;
}) {
  const { auth_error } = await searchParams;
  return <HomeView authError={auth_error === "1"} />;
}
