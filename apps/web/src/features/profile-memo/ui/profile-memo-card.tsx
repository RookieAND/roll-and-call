import { HStack, Text } from "@roll-and-call/ui";
import { Lock } from "lucide-react";
import Link from "next/link";

import { topicParticle } from "@/shared/lib";

interface ProfileMemoCardProps {
  targetId: string;
  targetName: string;
  body: string;
}

export function ProfileMemoCard({ targetId, targetName, body }: ProfileMemoCardProps) {
  return (
    <div className="rounded-500 border border-gray-200 bg-gray-50 p-175">
      <HStack align="center" gap="100">
        <Lock size={14} className="flex-none text-gray-600" aria-hidden />
        <Text weight="bold" typography="body4" foreground="muted" className="flex-1">
          내가 쓴 메모
        </Text>
        <Link href={`/u/${targetId}/memo`}>
          <Text weight="bold" typography="body4" foreground="primary">
            수정
          </Text>
        </Link>
      </HStack>
      <Text
        typography="body3"
        render={<p />}
        className="mt-125 leading-[1.7] whitespace-pre-line text-gray-700"
      >
        {body}
      </Text>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-125">
        {targetName}
        {topicParticle(targetName)} 이 메모를 보지 못합니다.
      </Text>
    </div>
  );
}
