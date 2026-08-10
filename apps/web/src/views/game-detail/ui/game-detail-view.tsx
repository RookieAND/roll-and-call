import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, HStack, VStack } from "@trpg/ui";
import { deriveGameStatus, gameStatusLabel } from "@/entities/game";
import { getGameById } from "@/entities/game/api/queries";
import { DeleteGameButton, deleteGame } from "@/features/delete-game";
import { JoinButton, joinGame, leaveGame } from "@/features/join-game";
import { createClient } from "@/shared/api/supabase/server";
import { formatDateTime } from "@/shared/lib/format";

export async function GameDetailView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isKp = user?.id === game.kpId;
  const hasJoined = user
    ? game.participants.some((p) => p.userId === user.id)
    : false;

  const count = game.participants.length;
  const status = deriveGameStatus(game, count);

  return (
    <Container size="md">
      <VStack gap={4} className="py-8">
        <HStack justify="between" align="center">
          <h1 className="text-2xl font-bold">{game.title}</h1>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {gameStatusLabel[status]}
          </span>
        </HStack>

        <VStack gap={1} className="text-sm text-gray-600">
          <span>룰: {game.rule}</span>
          <span>KP: {game.kp?.username ?? "?"}</span>
          <span>
            인원: {count}/{game.maxPlayers}명
          </span>
          {game.playTime && <span>플레이타임: {game.playTime}</span>}
          <span>모집 마감: {formatDateTime(game.endDate)}</span>
          {game.scheduleMode === "fixed" && game.confirmedAt && (
            <span>세션 일시: {formatDateTime(game.confirmedAt)}</span>
          )}
          {game.scheduleMode === "coordinate" && (
            <span>
              조율 기간: {game.rangeStart} ~ {game.rangeEnd}
            </span>
          )}
        </VStack>

        {game.scheduleMode === "coordinate" && (
          <Link
            href={`/games/${game.id}/schedule`}
            className="w-fit rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            일정 조율 {game.confirmedAt ? "보기" : "하기"}
          </Link>
        )}

        {game.synopsis && (
          <p className="whitespace-pre-wrap text-gray-800">{game.synopsis}</p>
        )}

        <VStack gap={1}>
          <h2 className="font-semibold">참여자 ({count})</h2>
          {count === 0 ? (
            <p className="text-sm text-gray-500">아직 참여자가 없어요.</p>
          ) : (
            <ul className="list-inside list-disc text-sm text-gray-700">
              {game.participants.map((p) => (
                <li key={p.userId}>{p.user?.username ?? p.userId}</li>
              ))}
            </ul>
          )}
        </VStack>

        {!user && (
          <p className="text-sm text-gray-500">참여하려면 로그인하세요.</p>
        )}

        {user && !isKp && (
          <div>
            {status === "recruiting" ? (
              hasJoined ? (
                <JoinButton
                  gameId={game.id}
                  action={leaveGame}
                  label="참여 취소"
                  variant="danger"
                />
              ) : (
                <JoinButton
                  gameId={game.id}
                  action={joinGame}
                  label="참여하기"
                />
              )
            ) : hasJoined ? (
              <p className="text-sm text-gray-600">참여 확정됨</p>
            ) : (
              <p className="text-sm text-gray-500">모집이 마감되었습니다.</p>
            )}
          </div>
        )}

        {isKp && (
          <HStack gap={2}>
            <Link
              href={`/games/${game.id}/edit`}
              className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              수정
            </Link>
            <DeleteGameButton action={deleteGame.bind(null, game.id)} />
          </HStack>
        )}
      </VStack>
    </Container>
  );
}
