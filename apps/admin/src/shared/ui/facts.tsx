import { Grid, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

export interface Fact {
  label: string;
  value: ReactNode;
  danger?: boolean;
  sub?: string;
}

interface FactsProps {
  items: Fact[];
  columns?: 2 | 3 | 4;
}

const COLUMNS = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" } as const;

export function Facts({ items, columns = 4 }: FactsProps) {
  return (
    <Grid render={<dl />} className={`${COLUMNS[columns]} gap-x-200 gap-y-150`}>
      {items.map((item) => (
        <VStack key={item.label} gap="025" className="min-w-0">
          <Text typography="body4" foreground="hint" truncate render={<dt />}>
            {item.label}
          </Text>
          <Text
            typography="body3"
            weight="medium"
            foreground={item.danger ? "danger" : "normal"}
            numeric
            render={<dd />}
          >
            {item.value}
          </Text>
          {item.sub ? (
            <Text typography="body4" foreground="hint">
              {item.sub}
            </Text>
          ) : null}
        </VStack>
      ))}
    </Grid>
  );
}
