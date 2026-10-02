import { Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatSessionTime } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";

interface RemoveTargetProps {
  post: PostDetail;
}

export function RemoveTarget({ post }: RemoveTargetProps) {
  const firstLine = post.synopsis?.split("\n").find((line) => line.trim());
  return (
    <Card.Root radius={400} background="subtle" padding="sm" render={<VStack gap="050" />}>
      <HStack align="baseline" gap="100" className="min-w-0">
        <Text typography="subtitle2" className="shrink-0">
          {post.title}
        </Text>
        <Text typography="body4" foreground="hint" truncate>
          GM {post.gm.nickname} · {formatSessionTime(post.startsAt)}
        </Text>
      </HStack>
      {firstLine ? (
        <Text typography="body3" foreground="muted" truncate>
          {firstLine}
        </Text>
      ) : null}
    </Card.Root>
  );
}
