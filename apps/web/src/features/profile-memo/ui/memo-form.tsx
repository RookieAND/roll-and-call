"use client";

import { Avatar, Button, Text, Textarea } from "@trpg/ui";
import { Lock } from "lucide-react";
import { useState } from "react";

import { formatDate } from "@/shared/lib";
import { AppBar, toast, useAction } from "@/shared/ui";

import { deleteMemo } from "../api/delete-memo";
import { saveMemo } from "../api/save-memo";
import { MEMO_MAX_LENGTH } from "../model/memo-form";

export function MemoForm({
  targetId,
  targetName,
  targetAvatarUrl,
  defaultBody = "",
  updatedAt,
}: {
  targetId: string;
  targetName: string;
  targetAvatarUrl: string | null;
  defaultBody?: string;
  updatedAt?: Date | null;
}) {
  const [body, setBody] = useState(defaultBody);
  const { pending, run } = useAction();
  const canSave = body.trim().length > 0;

  return (
    <>
      <AppBar
        back={`/u/${targetId}`}
        title="메모"
        action={
          <Button
            variant="ghost"
            className="h-9 text-primary-ink"
            disabled={!canSave}
            loading={pending}
            onClick={() =>
              run(() => saveMemo({ targetId, body }), {
                onSuccess: () => toast.success("메모를 저장했습니다"),
              })
            }
          >
            저장
          </Button>
        }
      />

      <div className="flex items-center gap-150 border-b border-gray-100 px-200 py-175">
        <Avatar src={targetAvatarUrl} name={targetName} size="lg" />
        <div className="min-w-0 flex-1">
          <Text truncate typography="subtitle1">
            {targetName}
          </Text>
          <div className="mt-025 flex items-center gap-075">
            <Lock size={12} className="flex-none text-hint" aria-hidden />
            <Text typography="body4" foreground="hint">
              나만 봅니다
            </Text>
          </div>
        </div>
      </div>

      <div className="p-200">
        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="다음에 같이 할 때 기억할 것을 적어두세요."
          maxLength={MEMO_MAX_LENGTH}
          aria-label="메모 내용"
          className="min-h-[150px] leading-[1.7]"
        />
        <div className="mt-100 flex items-baseline gap-100">
          <Text typography="body4" foreground="hint" className="flex-1 leading-[1.6]">
            상대는 이 메모를 볼 수 없고, 알림도 가지 않습니다.
          </Text>
          <Text numeric typography="body4" foreground="hint" className="flex-none">
            {body.length} / {MEMO_MAX_LENGTH}
          </Text>
        </div>
      </div>

      {defaultBody && (
        <div className="border-t border-gray-200 px-200 pt-150 pb-200">
          <Button
            variant="outline"
            className="h-12 w-full border-danger-300 text-danger-600"
            loading={pending}
            onClick={() =>
              run(() => deleteMemo(targetId), {
                onSuccess: () => toast.success("메모를 지웠습니다"),
              })
            }
          >
            메모 삭제
          </Button>
          {updatedAt && (
            <Text typography="body4" foreground="hint" render={<p />} className="mt-100">
              {formatDate(updatedAt)}에 마지막으로 고쳤습니다.
            </Text>
          )}
        </div>
      )}
    </>
  );
}
