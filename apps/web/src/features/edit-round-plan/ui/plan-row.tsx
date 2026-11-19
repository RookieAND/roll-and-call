import { Button, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

interface PlanRowProps {
  label: string;
  value?: string;
  onClick: () => void;
}

export function PlanRow({ label, value, onClick }: PlanRowProps) {
  return (
    <Button
      variant="ghost"
      colorPalette="gray"
      className="h-14 w-full justify-between rounded-none px-150"
      onClick={onClick}
    >
      <Text typography="body2" weight="bold">
        {label}
      </Text>
      <span className="flex items-center gap-050">
        {value && (
          <Text typography="body3" foreground="muted">
            {value}
          </Text>
        )}
        <ChevronRight size={17} aria-hidden className="flex-none text-hint" />
      </span>
    </Button>
  );
}
