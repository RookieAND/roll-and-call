"use client";

import { Avatar, Button, IconButton, Text, cn } from "@trpg/ui";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { MemberActionSheet, PromoteButton, SwapSheet } from "@/features/adjust-roster";
import type { ManagedMember } from "../model/managed-member";

const ROW = "flex min-h-14 items-center gap-3 border-t border-gray-100 px-3 py-2 first:border-t-0";

// 확정·대기를 신청 순서 한 목록으로 놓고 사이에 정원선을 둔다.
// "4번이 대기인데 5번이 확정"인 이유(GM이 건너뛰고 올림)가 행 옆에 바로 보이게 한다.
export function RosterList({
  gameId,
  confirmed,
  waiting,
  maxPlayers,
  isFull,
  isCoordinate,
  locked,
}: {
  gameId: string;
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
  maxPlayers: number;
  isFull: boolean;
  isCoordinate: boolean;
  locked: boolean;
}) {
  const [menuMember, setMenuMember] = useState<ManagedMember | null>(null);
  const [incoming, setIncoming] = useState<ManagedMember | null>(null);

  const total = confirmed.length + waiting.length;
  // 빈 자리를 채울 사람 = 대기 맨 앞(서버의 promoteWaitlistHead와 같은 기준)
  const filler = waiting[0] ? { userId: waiting[0].userId, username: waiting[0].username } : undefined;
  const scheduleHref = isCoordinate ? `/games/${gameId}/schedule` : null;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Text typography="body3" foreground="muted" render={<h2 />} className="font-bold">
          신청 순서 명단 {total}명
        </Text>
        <Text typography="body3" foreground="muted">
          정원 {maxPlayers}명
        </Text>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        {confirmed.map((member) => {
          const skipped = waiting
            .filter((w) => w.applicationRank < member.applicationRank)
            .map((w) => w.applicationRank);
          const availability = isCoordinate
            ? member.hasAvailability
              ? "가능 시간 제출"
              : "가능 시간 미제출"
            : null;
          const note = [availability, skipped.length > 0 ? `${skipped.join("·")}번을 건너뛰고 올림` : null]
            .filter(Boolean)
            .join(" · ");
          const noteClass = cn("block truncate", isCoordinate && !member.hasAvailability && "text-warning-600");

          return (
            <div key={member.userId} className={ROW}>
              <Text typography="code2" foreground="hint" className="w-5 shrink-0 text-center tabular-nums">
                {member.applicationRank}
              </Text>
              <Avatar src={member.avatarUrl} name={member.username} size="stack" />
              <div className="min-w-0 flex-1">
                <Text typography="subtitle2" className="block truncate">
                  {member.username}
                </Text>
                {note && (
                  <Text typography="body4" foreground="muted" className={noteClass}>
                    {note}
                  </Text>
                )}
              </div>
              {!locked && (
                <IconButton
                  variant="outline"
                  aria-label={`${member.username} 메뉴`}
                  onClick={() => setMenuMember(member)}
                  className="h-11 w-11 shrink-0 rounded-[10px] border-gray-200 text-gray-600"
                >
                  <MoreHorizontal size={16} aria-hidden />
                </IconButton>
              )}
            </div>
          );
        })}
        {confirmed.length === 0 && (
          <div className="px-3 py-4">
            <Text typography="body3" foreground="muted">
              아직 확정된 참여자가 없습니다.
            </Text>
          </div>
        )}

        {waiting.length > 0 && (
          <>
            <div className="flex items-center gap-2 border-y border-dashed border-tinted-border bg-tinted-bg px-3 py-1.5">
              <Text typography="body4" className="font-bold text-tinted-ink">
                정원 {maxPlayers}명
              </Text>
              <Text typography="body4" foreground="hint">
                여기까지 확정
              </Text>
            </div>
            <div className="bg-gray-50">
              {waiting.map((member) => (
                <div key={member.userId} className={ROW}>
                  <Text typography="code2" foreground="hint" className="w-5 shrink-0 text-center tabular-nums">
                    {member.applicationRank}
                  </Text>
                  <Avatar src={member.avatarUrl} name={member.username} />
                  <div className="min-w-0 flex-1">
                    <Text typography="subtitle2" className="block truncate">
                      {member.username}
                    </Text>
                    <Text typography="body4" foreground="muted" className="block">
                      대기 {member.waitlistRank}번
                    </Text>
                  </div>
                  {!locked &&
                    (isFull ? (
                      <Button variant="outline" size="sm" className="h-9" onClick={() => setIncoming(member)}>
                        교체
                      </Button>
                    ) : (
                      <PromoteButton gameId={gameId} member={member} />
                    ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <MemberActionSheet
        gameId={gameId}
        member={menuMember}
        filler={filler}
        scheduleHref={scheduleHref}
        onClose={() => setMenuMember(null)}
      />
      <SwapSheet
        gameId={gameId}
        incoming={incoming}
        candidates={confirmed}
        maxPlayers={maxPlayers}
        isCoordinate={isCoordinate}
        onClose={() => setIncoming(null)}
      />
    </section>
  );
}
