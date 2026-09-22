import { Button, HStack, Text } from "@roll-and-call/ui";
import { Lock } from "lucide-react";
import Link from "next/link";

import { topicParticle } from "@/shared/lib";

interface EmptyProfileMemoCardProps {
  targetId: string;
  targetName: string;
}

export function EmptyProfileMemoCard({ targetId, targetName }: EmptyProfileMemoCardProps) {
  return (
    <div className="rounded-500 border border-dashed border-gray-300 p-175">
      <HStack align="center" gap="100">
        <Lock size={14} className="flex-none text-gray-600" aria-hidden />
        <Text weight="bold" typography="body4" foreground="muted" className="flex-1">
          내가 쓴 메모
        </Text>
      </HStack>
      <Text typography="body3" foreground="hint" render={<p />} className="mt-100">
        이 사람에 대해 남긴 것이 없습니다.
      </Text>
      <Button asChild variant="outline" className="mt-150 h-11 w-full">
        <Link href={`/u/${targetId}/memo`}>메모 쓰기</Link>
      </Button>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-125">
        {targetName}
        {topicParticle(targetName)} 이 메모를 보지 못합니다.
      </Text>
    </div>
  );
}
