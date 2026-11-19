import { Button, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

interface PlanRowProps {
  label: string;
  description: string;
  onClick: () => void;
}

export function PlanRow({ label, description, onClick }: PlanRowProps) {
  return (
    <Button
      variant="ghost"
      colorPalette="gray"
      className="h-auto min-h-16 w-full justify-between rounded-none px-150 py-125"
      onClick={onClick}
    >
      <VStack align="start" gap="025" className="min-w-0 text-left">
        <Text typography="body2" weight="bold">
          {label}
        </Text>
        <Text typography="body4" foreground="muted">
          {description}
        </Text>
      </VStack>
      <ChevronRight size={17} aria-hidden className="flex-none text-hint" />
    </Button>
  );
}
