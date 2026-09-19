import { ManageGameView } from "@/views/manage-game";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManageGameView id={id} />;
}
