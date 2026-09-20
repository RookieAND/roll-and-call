import { Text, cn } from "@trpg/ui";

export function Legend({
  label,
  swatchClass,
  swatchStyle,
}: {
  label: string;
  swatchClass?: string;
  swatchStyle?: React.CSSProperties;
}) {
  return (
    <span className="inline-flex items-center gap-075">
      <span
        aria-hidden
        className={cn("inline-block size-3.5 rounded-100", swatchClass)}
        style={swatchStyle}
      />
      <Text typography="body4" foreground="muted" render={<span />}>
        {label}
      </Text>
    </span>
  );
}
