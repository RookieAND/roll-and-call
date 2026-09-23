import { Text, cn } from "@roll-and-call/ui";

interface LegendProps {
  label: string;
  swatchClass?: string;
  swatchStyle?: React.CSSProperties;
}

export function Legend({ label, swatchClass, swatchStyle }: LegendProps) {
  return (
    <span className="inline-flex items-center gap-075">
      <span
        aria-hidden
        className={cn("inline-block size-3 rounded-100", swatchClass)}
        style={swatchStyle}
      />
      <Text typography="body4" foreground="muted" render={<span />}>
        {label}
      </Text>
    </span>
  );
}
