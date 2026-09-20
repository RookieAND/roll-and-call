import { Button, Text } from "@trpg/ui";
import { Lock } from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/shared/lib";

export function ProfileMemoBlock({
  targetId,
  memo,
}: {
  targetId: string;
  memo: { body: string; updatedAt: Date } | null;
}) {
  const boxClass = memo
    ? "rounded-xl border border-gray-200 bg-gray-50 p-3.5"
    : "rounded-xl border border-dashed border-gray-300 p-3.5";

  return (
    <div className="px-4 pb-4">
      <div className={boxClass}>
        <div className="flex items-center gap-[7px]">
          <Lock size={14} className="flex-none text-gray-600" aria-hidden />
          <Text typography="subtitle3" foreground="muted" className="flex-1">
            내가 쓴 메모
          </Text>
          {memo && (
            <Link href={`/u/${targetId}/memo`}>
              <Text weight="bold" typography="body4" foreground="primary">
                수정
              </Text>
            </Link>
          )}
        </div>

        {memo ? (
          <>
            <Text
              typography="body3"
              render={<p />}
              className="mt-[9px] leading-[1.7] whitespace-pre-line text-gray-700"
            >
              {memo.body}
            </Text>
            <Text typography="body4" foreground="hint" render={<p />} className="mt-[9px]">
              {formatDate(memo.updatedAt)}에 마지막으로 고쳤습니다.
            </Text>
          </>
        ) : (
          <>
            <Text typography="body3" foreground="hint" render={<p />} className="mt-2">
              이 사람에 대해 남긴 것이 없습니다.
            </Text>
            <Button asChild variant="outline" className="mt-[11px] h-11 w-full">
              <Link href={`/u/${targetId}/memo`}>메모 쓰기</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
