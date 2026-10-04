import { Text, VStack } from "@roll-and-call/ui";

interface ConfirmSessionDialogBodyProps {
  windowLabel: string;
  changing: boolean;
  confirmedCount: number;
  maxPlayers: number;
}

// 제목 아래: 세션 시간 → 본문 줄 → (확정 0명이면 주황 경고) → 알림 줄.
export function ConfirmSessionDialogBody({
  windowLabel,
  changing,
  confirmedCount,
  maxPlayers,
}: ConfirmSessionDialogBodyProps) {
  const shortfall = !changing && confirmedCount < maxPlayers;
  const empty = confirmedCount === 0;

  return (
    <VStack gap="100" className="break-keep">
      <Text numeric typography="subtitle1" foreground="success" render={<p />}>
        {windowLabel}
      </Text>
      {!changing && (
        <Text typography="body3" foreground="muted" render={<p />}>
          확정하면 새 신청을 받지 않습니다.
          <br />
          명단은 세션이 끝날 때까지 참여자 관리에서 고칠 수 있습니다.
        </Text>
      )}
      {shortfall && (
        <Text numeric typography="body3" foreground="muted" render={<p />}>
          정원 {maxPlayers}명 중 {confirmedCount}명으로 확정하면 모집이 닫힙니다.
        </Text>
      )}
      {empty && (
        <Text typography="body3" foreground="warning" weight="medium" render={<p />}>
          확정된 참여자가 없습니다.
          <br />
          이대로 확정하면 출석 확인 없이 끝납니다.
        </Text>
      )}
      <Text typography="body3" foreground="muted" render={<p />}>
        확정 참여자에게 알림 탭으로 알립니다.
        {changing && (
          <>
            <br />
            이전에 확정한 시간은 사라집니다.
          </>
        )}
      </Text>
    </VStack>
  );
}
