import { Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MobileSettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function MobileSettingsSection({ title, children }: MobileSettingsSectionProps) {
  return (
    <VStack
      gap="125"
      render={<section aria-label={title} />}
      className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
    >
      <Text typography="subtitle1" render={<h2 />}>
        {title}
      </Text>
      {children}
    </VStack>
  );
}
