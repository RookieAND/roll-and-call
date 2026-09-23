"use client";

import { Button, Field, Text, Textarea } from "@roll-and-call/ui";
import { Lock } from "lucide-react";
import { useState } from "react";

import { ProfileRow } from "@/entities/profile";
import { formatDate } from "@/shared/lib";
import { AppBar, toast, useAction } from "@/shared/ui";

import { deleteMemo } from "../api/delete-memo";
import { saveMemo } from "../api/save-memo";
import { MEMO_MAX_LENGTH } from "../model/memo-form";

interface MemoFormProps {
  targetId: string;
  targetName: string;
  targetAvatarUrl: string | null;
  defaultBody?: string;
  updatedAt?: Date | null;
}

export function MemoForm({
  targetId,
  targetName,
  targetAvatarUrl,
  defaultBody = "",
  updatedAt,
}: MemoFormProps) {
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
            colorPalette="primary"
            size="sm"
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

      <ProfileRow
        size="lg"
        name={targetName}
        avatarUrl={targetAvatarUrl}
        subline={
          <>
            <Lock size={12} className="mr-050 inline align-[-1px]" aria-hidden />
            나만 봅니다
          </>
        }
        sublineForeground="hint"
        className="flex-none border-b border-gray-100 px-200 py-175"
      />

      <div className="p-200">
        <Field.Root
          label="메모"
          htmlFor="memo"
          counter={`${body.length} / ${MEMO_MAX_LENGTH}`}
          description="상대는 이 메모를 볼 수 없고, 알림도 가지 않습니다."
        >
          <Textarea
            id="memo"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="다음에 같이 할 때 기억할 것을 적어두세요."
            maxLength={MEMO_MAX_LENGTH}
            rows={6}
          />
        </Field.Root>
      </div>

      {defaultBody && (
        <div className="border-t border-gray-200 px-200 pt-150 pb-200">
          <Button
            variant="outline"
            colorPalette="danger"
            size="lg"
            className="w-full"
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
