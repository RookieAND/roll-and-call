import { Button, HStack, Text } from "@trpg/ui";
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
    ? "rounded-500 border border-gray-200 bg-gray-50 p-175"
    : "rounded-500 border border-dashed border-gray-300 p-175";

  return (
    <div className="px-200 pb-200">
      <div className={boxClass}>
        <HStack align="center" gap="100">
          <Lock size={14} className="flex-none text-gray-600" aria-hidden />
          <Text weight="bold" typography="body4" foreground="muted" className="flex-1">
            내가 쓴 메모
          </Text>
          {memo && (
            <Link href={`/u/${targetId}/memo`}>
              <Text weight="bold" typography="body4" foreground="primary">
                수정
              </Text>
            </Link>
          )}
        </HStack>

        {memo ? (
          <>
            <Text
              typography="body3"
              render={<p />}
              className="mt-125 leading-[1.7] whitespace-pre-line text-gray-700"
            >
              {memo.body}
            </Text>
            <Text typography="body4" foreground="hint" render={<p />} className="mt-125">
              {formatDate(memo.updatedAt)}에 마지막으로 고쳤습니다.
            </Text>
          </>
        ) : (
          <>
            <Text typography="body3" foreground="hint" render={<p />} className="mt-100">
              이 사람에 대해 남긴 것이 없습니다.
            </Text>
            <Button asChild variant="outline" className="mt-150 h-11 w-full">
              <Link href={`/u/${targetId}/memo`}>메모 쓰기</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
