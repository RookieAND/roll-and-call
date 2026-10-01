import { IconButton, cn } from "@roll-and-call/ui";

interface CarouselDotProps {
  label: string;
  active: boolean;
  onSelect: () => void;
}

export function CarouselDot({ label, active, onSelect }: CarouselDotProps) {
  return (
    <IconButton
      variant="ghost"
      aria-label={label}
      aria-current={active ? "true" : undefined}
      onClick={onSelect}
      className="h-11 w-auto min-w-7 px-050 hover:bg-transparent"
    >
      <span
        className={cn(
          "h-2 rounded-full transition-all duration-300",
          active ? "w-7 bg-primary-600" : "w-2 bg-gray-300",
        )}
      />
    </IconButton>
  );
}
