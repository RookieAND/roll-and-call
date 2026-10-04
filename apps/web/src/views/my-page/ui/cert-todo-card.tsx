import { Button, Card, HStack, Text } from "@roll-and-call/ui";
import { CircleAlert } from "lucide-react";

import { DiscardApplicationButton } from "@/features/certify-rulebook";
import { LineBreaks, ServerLink } from "@/shared/ui";
import type { CertTodoItem } from "@/widgets/session-list";

interface CertTodoCardProps {
  item: CertTodoItem;
}

export function CertTodoCard({ item }: CertTodoCardProps) {
  return (
    <Card.Root padding="none" className="p-175">
      <HStack align="center" gap="100" className="text-warning-600">
        <CircleAlert size={14} strokeWidth={2.2} aria-hidden className="shrink-0" />
        <Text weight="bold" typography="body4" foreground="inherit">
          {item.eyebrow}
        </Text>
      </HStack>
      <Text truncate typography="heading3" render={<h3 />} className="mt-100">
        {item.title}
      </Text>
      <Text
        typography="body4"
        foreground="muted"
        render={<p />}
        className="mt-050 [text-wrap:pretty]"
      >
        <LineBreaks lines={item.lines} />
      </Text>
      <HStack gap="100" className="mt-150">
        <DiscardApplicationButton rulebookId={item.rulebookId} className="min-w-0 flex-1" />
        <Button
          render={<ServerLink path={`/me/rulebooks/apply?rulebook=${item.rulebookId}`} />}
          variant="tinted"
          className="min-w-0 flex-1"
        >
          다시 신청하기
        </Button>
      </HStack>
    </Card.Root>
  );
}
