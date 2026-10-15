import { Callout, VStack } from "@roll-and-call/ui";

import type { RulebookDetail } from "@/entities/rulebook/server";

interface RulebookKindNoticesProps {
  rulebook: Pick<RulebookDetail, "kind" | "categoryMiniRule">;
}

export function RulebookKindNotices({ rulebook }: RulebookKindNoticesProps) {
  const supplement = rulebook.kind === "supplement";
  if (!supplement && !rulebook.categoryMiniRule) return null;
  return (
    <VStack gap="100" className="px-150 pt-150">
      {rulebook.categoryMiniRule ? (
        <Callout.Root colorPalette="gray">
          <Callout.Icon />
          <Callout.Title>미니룰입니다</Callout.Title>
          <Callout.Description>
            이 룰북으로 연 세션은 이달의 기록 순위와 이달의 GM·PL에서 빠집니다. 업적과 세션 건수에는
            그대로 셉니다.
          </Callout.Description>
        </Callout.Root>
      ) : null}
      {supplement ? (
        <Callout.Root colorPalette="gray">
          <Callout.Icon />
          <Callout.Title>서플리먼트입니다</Callout.Title>
          <Callout.Description>
            같은 카테고리의 기본 룰북 가운데에서 연결할 책을 고릅니다.
          </Callout.Description>
        </Callout.Root>
      ) : null}
    </VStack>
  );
}
