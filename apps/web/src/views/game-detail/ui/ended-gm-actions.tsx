import { Button, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { ActionNotice } from "./action-notice";
import { ManageGameLink } from "./manage-game-link";

interface EndedGmActionsProps {
  gameId: string;
  attendanceDue: boolean;
  attendanceConfirmed: boolean;
}

// 출석 확인 흐름은 11을 따른다. 확인을 마치면 기록 보기 하나로 바뀐다.
export function EndedGmActions({
  gameId,
  attendanceDue,
  attendanceConfirmed,
}: EndedGmActionsProps) {
  const attendanceHref = `/games/${gameId}/attendance`;

  if (attendanceDue) {
    return (
      <VStack gap="125">
        <ActionNotice title="출석을 확인해 주세요" colorPalette="primary">
          참석하지 않은 사람만 고르면 됩니다.
        </ActionNotice>
        <Button render={<Link href={attendanceHref} />} size="lg" className="w-full">
          출석 확인하기
        </Button>
      </VStack>
    );
  }

  if (attendanceConfirmed) {
    return (
      <Button render={<Link href={attendanceHref} />} variant="tinted" size="lg" className="w-full">
        출석 기록 보기
      </Button>
    );
  }

  return <ManageGameLink gameId={gameId} />;
}
