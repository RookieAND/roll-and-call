import { Text, VStack } from "@roll-and-call/ui";
import { Check, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function EmptyState({ title, description, icon: Icon = Check }: EmptyStateProps) {
  return (
    <VStack align="center" justify="center" className="h-full p-300 text-center">
      <span className="mb-150 grid size-[44px] place-items-center rounded-full bg-gray-100 text-hint">
        <Icon size={20} aria-hidden />
      </span>
      <Text typography="heading3">{title}</Text>
      {description ? (
        <Text typography="body3" foreground="hint" className="mt-050 max-w-[320px]">
          {description}
        </Text>
      ) : null}
    </VStack>
  );
}
