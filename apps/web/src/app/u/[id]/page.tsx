import { UserProfileView } from "@/views/user-profile";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserProfileView id={id} />;
}
