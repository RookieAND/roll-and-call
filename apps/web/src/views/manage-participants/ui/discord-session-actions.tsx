"use client";

import { Button, Text } from "@trpg/ui";
import Link from "next/link";
import { useState } from "react";
import { useEndSession } from "@/features/end-session";
import { useOpenSessionRooms, useSessionRoomsEnabled } from "@/features/open-session-rooms";
import { ConfirmDialog } from "@/shared/ui";

export type DiscordRoomsStatus = {
  configured: boolean;
  opened: boolean;
  ended: boolean;
  disabled: boolean;
  // GM이 자동 개설을 켰는가(확정되면 열림)
  autoOpen: boolean;
  // 세션 시간이 확정됐는가
  sessionConfirmed: boolean;
  channelUrl: string | null;
};

// 이 세션의 디스코드 채널 상태 한 줄. 모든 상태가 같은 자리·같은 높이이고 오른쪽 버튼만 바뀐다:
// 연동 안 됨 / 이 구인은 끔 / 열림 / 종료됨 / 확정되면 열림 / 아직 안 열림.
// 규칙(자동 개설 등)은 /me/discord 설정이 갖고, 여기서는 이 구인의 상태만 읽고 바꾼다.
export function DiscordSessionActions({
  gameId,
  status,
  confirmedCount,
}: {
  gameId: string;
  status: DiscordRoomsStatus;
  confirmedCount: number;
}) {
  const [confirmingOpen, setConfirmingOpen] = useState(false);
  const [confirmingEnd, setConfirmingEnd] = useState(false);
  const { pending: opening, openRooms } = useOpenSessionRooms(gameId, () => setConfirmingOpen(false));
  const { pending: ending, endSession } = useEndSession(gameId, () => setConfirmingEnd(false));
  const { pending: toggling, setEnabled } = useSessionRoomsEnabled(gameId);

  const buttonClass = "h-9 shrink-0";
  let title: string;
  let sub: string;
  let action: React.ReactNode = null;

  if (!status.configured) {
    title = "디스코드가 연동되지 않았습니다";
    sub = "채널·공지·알림이 모두 꺼져 있습니다";
    action = (
      <Button asChild variant="outline" size="sm" className={buttonClass}>
        <Link href="/me/discord">연동하기</Link>
      </Button>
    );
  } else if (status.ended) {
    title = "세션 종료됨";
    sub = "채널을 보관하고 참여자 접근을 닫았습니다";
  } else if (status.opened) {
    title = "세션 채널 열림";
    sub = "뒤에 확정되는 참여자도 자동으로 합류합니다";
    action = (
      <div className="flex shrink-0 gap-1.5">
        {status.channelUrl && (
          <Button asChild variant="outline" size="sm" className={buttonClass}>
            <a href={status.channelUrl} target="_blank" rel="noreferrer">
              열기
            </a>
          </Button>
        )}
        <Button variant="outline" size="sm" className={buttonClass} onClick={() => setConfirmingEnd(true)}>
          종료
        </Button>
      </div>
    );
  } else if (status.disabled) {
    title = "채널을 쓰지 않습니다";
    sub = "이 구인에서만 껐습니다";
    action = (
      <Button
        variant="outline"
        size="sm"
        className={buttonClass}
        loading={toggling}
        onClick={() => setEnabled(true)}
      >
        다시 켜기
      </Button>
    );
  } else {
    const canOpen = confirmedCount > 0;
    title =
      status.autoOpen && !status.sessionConfirmed ? "세션이 확정되면 열립니다" : "세션 채널을 열지 않았습니다";
    sub = canOpen
      ? `지금 열면 확정된 ${confirmedCount}명이 합류합니다`
      : "확정 참여자가 생기면 열 수 있습니다";
    action = (
      <div className="flex shrink-0 gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className={buttonClass}
          loading={toggling}
          onClick={() => setEnabled(false)}
        >
          끄기
        </Button>
        {canOpen && (
          <Button variant="outline" size="sm" className={buttonClass} onClick={() => setConfirmingOpen(true)}>
            지금 열기
          </Button>
        )}
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <Text typography="body3" foreground="muted" render={<h2 />} className="font-bold">
        디스코드
      </Text>
      <div className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 px-3.5 py-2.5">
        <div className="min-w-0 flex-1">
          <Text typography="subtitle2" className="block">
            {title}
          </Text>
          <Text typography="body4" foreground="hint" className="block">
            {sub}
          </Text>
        </div>
        {action}
      </div>

      <ConfirmDialog
        open={confirmingOpen}
        onOpenChange={setConfirmingOpen}
        title="세션 채널 열기"
        description={`확정 참여자 ${confirmedCount}명이 들어갈 디스코드 채널을 엽니다. 연 채널은 앱에서 닫을 수 없습니다.`}
        confirmLabel="열기"
        pending={opening}
        onConfirm={openRooms}
      />
      <ConfirmDialog
        open={confirmingEnd}
        onOpenChange={setConfirmingEnd}
        title="세션 종료"
        description="세션 채널에서 참여자 접근 권한을 모두 회수합니다. 기록은 GM만 읽을 수 있습니다."
        confirmLabel="종료"
        pending={ending}
        onConfirm={endSession}
      />
    </section>
  );
}
