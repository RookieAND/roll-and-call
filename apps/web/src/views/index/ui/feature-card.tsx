import { Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: ReactNode;
  visual: ReactNode;
}

export function FeatureCard({ title, description, visual }: FeatureCardProps) {
  return (
    <VStack className="overflow-hidden rounded-700 border border-gray-200">
      <div aria-hidden className="h-[132px] bg-gray-50 p-225">
        {visual}
      </div>
      <VStack gap="075" className="px-225 pt-225 pb-250">
        <Text typography="subtitle1" weight="bold" render={<h3 />}>
          {title}
        </Text>
        <Text typography="body4" foreground="muted">
          {description}
        </Text>
      </VStack>
    </VStack>
  );
}
