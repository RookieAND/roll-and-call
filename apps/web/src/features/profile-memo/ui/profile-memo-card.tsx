import { Card, HStack, IconButton, Text } from "@roll-and-call/ui";
import { Lock, Pencil } from "lucide-react";
import Link from "next/link";

import { topicParticle } from "@/shared/lib";

interface ProfileMemoCardProps {
  targetId: string;
  targetName: string;
  body: string;
}

export function ProfileMemoCard({ targetId, targetName, body }: ProfileMemoCardProps) {
  return (
    <Card.Root background="subtle" padding="sm" radius={500}>
      <HStack align="center" gap="100" className="-mt-100 -mr-100">
        <Lock size={14} className="flex-none text-gray-600" aria-hidden />
        <Text weight="bold" typography="body4" foreground="muted" className="flex-1">
          내가 쓴 메모
        </Text>
        <IconButton
          render={<Link href={`/u/${targetId}/memo`} />}
          variant="ghost"
          aria-label="메모 수정"
          className="h-11 w-11"
        >
          <Pencil size={16} aria-hidden />
        </IconButton>
      </HStack>
      {/* 사용자가 쓴 글이라 줄바꿈을 그대로 살린다. */}
      <Text typography="body3" render={<p />} className="whitespace-pre-line">
        {body}
      </Text>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-125">
        {targetName}
        {topicParticle(targetName)} 이 메모를 보지 못합니다.
      </Text>
    </Card.Root>
  );
}
