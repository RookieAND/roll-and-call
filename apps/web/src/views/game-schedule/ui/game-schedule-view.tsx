import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, VStack } from "@trpg/ui";
import {
  getGameAvailabilities,
  getGameById,
  getUserConfirmedSlots,
} from "@/entities/game/api/queries";
import { AvailabilityGrid, Heatmap } from "@/features/availability";
import { ConfirmSessionForm } from "@/features/confirm-session";
import { createClient } from "@/shared/api/supabase/server";
import { formatDateTime } from "@/shared/lib/format";
import { buildDayColumns, buildTimeRows } from "@/shared/lib/slots";

export async function GameScheduleView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  const backLink = (
    <Link href={`/games/${id}`} className="text-sm text-gray-500 underline">
      ← 게임으로
    </Link>
  );

  if (game.scheduleMode !== "coordinate" || !game.rangeStart || !game.rangeEnd) {
    return (
      <Container size="md">
        <VStack gap={4} className="py-8">
          <h1 className="text-2xl font-bold">{game.title}</h1>
          <p className="text-gray-500">일시가 지정된 게임이라 조율이 필요 없어요.</p>
          {backLink}
        </VStack>
      </Container>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isKp = user?.id === game.kpId;
  const involved =
    !!user &&
    (isKp || game.participants.some((p) => p.userId === user.id));

  const days = buildDayColumns(game.rangeStart, game.rangeEnd);
  const timeRows = buildTimeRows();

  const avails = await getGameAvailabilities(id);
  const counts: Record<string, number> = {};
  const names: Record<string, string[]> = {};
  const mine: string[] = [];
  for (const a of avails) {
    const iso = a.slotStart.toISOString();
    counts[iso] = (counts[iso] ?? 0) + 1;
    (names[iso] ??= []).push(a.user?.username ?? "?");
    if (user && a.userId === user.id) mine.push(iso);
  }
  const maxCount = Math.max(0, ...Object.values(counts));

  const blocked = user ? await getUserConfirmedSlots(user.id, id) : [];

  const confirmOptions = Object.entries(counts)
    .toSorted((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 40)
    .map(([iso, count]) => ({
      iso,
      label: `${formatDateTime(iso)} · ${count}명`,
    }));

  return (
    <Container>
      <VStack gap={6} className="py-8">
        <VStack gap={1}>
          <h1 className="text-2xl font-bold">{game.title} · 일정 조율</h1>
          {backLink}
        </VStack>

        {game.confirmedAt && (
          <p className="rounded-md bg-green-50 px-4 py-2 text-green-700">
            확정된 세션: {formatDateTime(game.confirmedAt)}
          </p>
        )}

        {involved && !game.confirmedAt && (
          <VStack gap={2}>
            <h2 className="font-semibold">내 가능 시간</h2>
            <AvailabilityGrid
              gameId={id}
              days={days}
              timeRows={timeRows}
              initialMine={mine}
              blocked={blocked}
            />
          </VStack>
        )}

        <VStack gap={2}>
          <h2 className="font-semibold">전체 겹침</h2>
          <Heatmap
            days={days}
            timeRows={timeRows}
            counts={counts}
            names={names}
            maxCount={maxCount}
          />
        </VStack>

        {isKp && !game.confirmedAt && (
          <ConfirmSessionForm gameId={id} options={confirmOptions} />
        )}
      </VStack>
    </Container>
  );
}
