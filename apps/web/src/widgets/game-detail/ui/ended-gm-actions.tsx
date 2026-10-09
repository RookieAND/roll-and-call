import { Badge, Button, VStack } from "@roll-and-call/ui";

import { ReopenGameLink } from "@/features/reopen-game";
import { formatDateWeekday, formatDday } from "@/shared/lib";
import { ServerLink } from "@/shared/ui";

import { REVIEW_STATUS, type ReviewStatus } from "../model/review-status";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { ManageGameLink } from "./manage-game-link";

interface EndedGmActionsProps {
  gameId: string;
  attendanceDue: boolean;
  attendanceRecorded: boolean;
  reopenable: boolean;
  endedOn: Date;
  review: ReviewStatus;
  reviewDaysLeft: number | null;
}

export function EndedGmActions({
  gameId,
  attendanceDue,
  attendanceRecorded,
  reopenable,
  endedOn,
  review,
  reviewDaysLeft,
}: EndedGmActionsProps) {
  const attendancePath = `/games/${gameId}/attendance`;

  if (attendanceDue) {
    return (
      <VStack gap="125">
        <ActionNotice
          title="출석을 확인해 주세요"
          lines={["참석하지 않은 사람만 고르면 됩니다."]}
          colorPalette="primary"
        />
        <ActionPair>
          <Button render={<ServerLink path={attendancePath} />} size="lg" className="w-full">
            출석 확인하기
          </Button>
          {reopenable && <ReopenGameLink gameId={gameId} />}
        </ActionPair>
      </VStack>
    );
  }

  if (attendanceRecorded) {
    return (
      <VStack gap="125">
        {review !== REVIEW_STATUS.unavailable && (
          <>
            <ActionNotice
              title={`${formatDateWeekday(endedOn)}에 세션이 끝났습니다`}
              lines={["출석 확인을 마쳤습니다."]}
            />
            {review === REVIEW_STATUS.writable ? (
              <Button
                render={<ServerLink path={`/games/${gameId}/review`} />}
                size="lg"
                className="w-full"
              >
                마스터링 후기 쓰기
                {reviewDaysLeft !== null && (
                  <Badge colorPalette="gray" className="bg-white/20 text-current">
                    후기 마감 {formatDday(reviewDaysLeft)}
                  </Badge>
                )}
              </Button>
            ) : (
              <Button
                render={<ServerLink path="/me/reviews" />}
                variant="outline"
                size="lg"
                className="w-full"
              >
                내 후기 보기
              </Button>
            )}
          </>
        )}
        <ActionPair>
          <Button
            render={<ServerLink path={attendancePath} />}
            variant="tinted"
            size="lg"
            className="w-full"
          >
            출석 기록 보기
          </Button>
          {reopenable && <ReopenGameLink gameId={gameId} />}
        </ActionPair>
      </VStack>
    );
  }

  return (
    <ActionPair>
      <ManageGameLink gameId={gameId} />
      {reopenable && <ReopenGameLink gameId={gameId} />}
    </ActionPair>
  );
}
