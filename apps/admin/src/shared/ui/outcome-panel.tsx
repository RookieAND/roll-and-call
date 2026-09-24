import { HStack, Text, VStack } from "@roll-and-call/ui";

import { Panel } from "./panel";

export interface Outcome {
  label: string;
  value: string;
  sub?: string;
  danger?: boolean;
}

interface OutcomePanelProps {
  items: Outcome[];
}

// 별도 페이지로 둔 조치(인증 취소·제재)의 오른쪽 요약.
export function OutcomePanel({ items }: OutcomePanelProps) {
  return (
    <Panel title="확정하면 일어나는 일" bodyClassName="px-175 pt-050 pb-125">
      <VStack render={<dl />}>
        {items.map((item) => (
          <HStack
            key={item.label}
            align="baseline"
            gap="150"
            className="border-t border-(--rc-color-border-subtle) py-100 first:border-t-0"
          >
            <VStack gap="025" className="min-w-0 flex-1">
              <Text typography="body4" foreground="muted" render={<dt />}>
                {item.label}
              </Text>
              {item.sub ? (
                <Text typography="body4" foreground="hint">
                  {item.sub}
                </Text>
              ) : null}
            </VStack>
            <Text
              typography="subtitle2"
              foreground={item.danger ? "danger" : undefined}
              numeric
              render={<dd />}
            >
              {item.value}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Panel>
  );
}
