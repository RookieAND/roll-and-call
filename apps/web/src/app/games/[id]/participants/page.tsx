import { ManageParticipantsView } from "@/views/manage-participants";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManageParticipantsView id={id} />;
}
