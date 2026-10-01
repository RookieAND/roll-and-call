import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import type { ListRow } from "../model/list-row";
import { ListRowItem } from "./list-row-item";

interface ListSectionProps {
  title: string;
  aside?: string;
  rows: ListRow[];
  children?: ReactNode;
}

export function ListSection({ title, aside, rows, children }: ListSectionProps) {
  return (
    <VStack gap="125" render={<section />}>
      <HStack align="baseline" gap="100">
        <Text typography="heading3" render={<h2 />}>
          {title}
        </Text>
        {aside && (
          <Text typography="body3" weight="medium" foreground="muted">
            {aside}
          </Text>
        )}
      </HStack>
      {rows.length > 0 && (
        <Card.Root padding="none" className="overflow-hidden">
          {rows.map((row) => (
            <ListRowItem key={row.key} row={row} />
          ))}
        </Card.Root>
      )}
      {children}
    </VStack>
  );
}
