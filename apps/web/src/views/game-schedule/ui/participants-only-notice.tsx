import { LoginSheetButton } from "@/features/auth";
import { EmptyState } from "@/shared/ui";

interface ParticipantsOnlyNoticeProps {
  gameId: string;
  isSignedIn: boolean;
}

export function ParticipantsOnlyNotice({ gameId, isSignedIn }: ParticipantsOnlyNoticeProps) {
  return (
    <EmptyState
      title="참여자만 가능 시간을 낼 수 있습니다"
      description="겹침은 누구나 볼 수 있습니다."
      action={
        !isSignedIn && (
          <LoginSheetButton next={`/games/${gameId}/schedule`} className="mt-100 w-full" />
        )
      }
    />
  );
}
