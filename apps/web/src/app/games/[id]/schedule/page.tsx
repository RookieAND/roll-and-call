import { GameScheduleView } from "@/views/game-schedule";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GameScheduleView id={id} />;
}
