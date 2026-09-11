import { AvatarGroup, Text, VStack } from "@trpg/ui";

const MAX_AVATARS = 5;

type Member = { user: { username: string; avatarUrl: string | null } | null };

// 확정 참여자 얼굴들과 대기 인원. 명단 전체는 GM의 참여자 관리 화면에서 본다.
export function GameRosterPreview({
  confirmed,
  waitingCount,
  maxPlayers,
}: {
  confirmed: Member[];
  waitingCount: number;
  maxPlayers: number;
}) {
  return (
    <VStack gap={2}>
      <Text typography="heading3">
        참여자 {confirmed.length}/{maxPlayers}
      </Text>
      {confirmed.length === 0 ? (
        <Text typography="body2" foreground="muted" render={<p />}>
          아직 참여자가 없어요.
        </Text>
      ) : (
        <AvatarGroup
          max={MAX_AVATARS}
          size="stack"
          people={confirmed.map((p) => ({ src: p.user?.avatarUrl, name: p.user?.username }))}
        />
      )}
      {waitingCount > 0 && (
        <Text typography="body3" foreground="muted">
          대기 {waitingCount}명
        </Text>
      )}
    </VStack>
  );
}
