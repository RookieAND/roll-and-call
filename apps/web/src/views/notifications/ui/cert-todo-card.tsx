import { Button, Card, HStack, VStack } from "@roll-and-call/ui";

import { DiscardApplicationButton } from "@/features/certify-rulebook";
import { ServerLink } from "@/shared/ui";
import type { CertTodoItem } from "@/widgets/session-list";

import { TodoCardBody } from "./todo-card-body";
import { TodoCardHead } from "./todo-card-head";

interface CertTodoCardProps {
  item: CertTodoItem;
}

export function CertTodoCard({ item }: CertTodoCardProps) {
  return (
    <VStack gap="050" render={<Card.Root padding="none" className="p-175" />}>
      <TodoCardHead eyebrow={item.eyebrow} blocked={item.blocked} />
      <TodoCardBody title={item.title} lines={item.lines} />
      <HStack gap="100" className="mt-125">
        <DiscardApplicationButton
          rulebookId={item.rulebookId}
          stay
          size="lg"
          className="min-w-0 flex-1"
        />
        <Button
          render={<ServerLink path={`/me/rulebooks/apply?rulebook=${item.rulebookId}`} />}
          variant="tinted"
          size="lg"
          className="min-w-0 flex-1"
        >
          다시 신청하기
        </Button>
      </HStack>
    </VStack>
  );
}
