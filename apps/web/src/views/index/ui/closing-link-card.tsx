import { Button, Text, VStack } from "@roll-and-call/ui";
import type { ReactElement, ReactNode } from "react";

interface ClosingLinkCardProps {
  title: string;
  description: ReactNode;
  actionLabel: string;
  link: ReactElement<Record<string, unknown>>;
}

export function ClosingLinkCard({ title, description, actionLabel, link }: ClosingLinkCardProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-250 gap-y-175 rounded-700 border border-gray-200 p-250">
      <VStack gap="075" className="flex-[1_1_220px]">
        <Text typography="subtitle1" weight="bold" render={<h3 />}>
          {title}
        </Text>
        <Text typography="body3" foreground="muted" render={<p />} className="[text-wrap:pretty]">
          {description}
        </Text>
      </VStack>
      <div className="max-w-full flex-[1_1_128px]">
        <Button variant="outline" size="md" className="w-full" render={link}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
