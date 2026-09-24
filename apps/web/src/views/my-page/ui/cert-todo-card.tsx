import { Button, Card, HStack, Text } from "@roll-and-call/ui";
import { CircleAlert } from "lucide-react";
import Link from "next/link";

import { rejectionSummary, type MyRulebook } from "@/entities/rulebook";

interface CertTodoCardProps {
  rulebook: MyRulebook;
}

// 반려된 룰북 인증. 세션 할 일과 같은 카드 모양으로 둔다.
export function CertTodoCard({ rulebook }: CertTodoCardProps) {
  return (
    <Card.Root padding="none" className="p-175">
      <HStack align="center" gap="100" className="text-warning-600">
        <CircleAlert size={14} strokeWidth={2.2} aria-hidden className="shrink-0" />
        <Text weight="bold" typography="body4" foreground="inherit">
          인증 반려
        </Text>
      </HStack>
      <Text truncate typography="heading3" render={<h3 />} className="mt-100">
        룰북 인증 다시 신청하기
      </Text>
      <Text
        typography="body4"
        foreground="muted"
        render={<p />}
        className="mt-050 [text-wrap:pretty]"
      >
        {rulebook.label} · {rejectionSummary(rulebook.latestApplication)}
      </Text>
      <Button
        render={<Link href={`/me/rulebooks/apply?rulebook=${rulebook.id}`} />}
        variant="tinted"
        className="mt-150 w-full"
      >
        다시 신청하기
      </Button>
    </Card.Root>
  );
}
