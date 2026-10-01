import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}

export function FormSection({ title, description, right, children }: FormSectionProps) {
  return (
    <VStack
      gap="125"
      render={<section />}
      className="border-t border-(--rc-color-border-subtle) pt-250 first:border-t-0 first:pt-0"
    >
      <HStack align="start" gap="100">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="heading3" render={<h3 />}>
            {title}
          </Text>
          {description ? (
            <Text typography="body4" foreground="hint">
              {description}
            </Text>
          ) : null}
        </VStack>
        {right}
      </HStack>
      {children}
    </VStack>
  );
}
