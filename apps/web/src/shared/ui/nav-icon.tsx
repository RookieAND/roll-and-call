import type { LucideIcon } from "lucide-react";

interface NavIconProps {
  Icon: LucideIcon;
  dot?: string;
}

export function NavIcon({ Icon, dot }: NavIconProps) {
  return (
    <span className="relative flex">
      <Icon size={26} strokeWidth={1.9} aria-hidden />
      {dot && (
        <span
          role="img"
          aria-label={dot}
          className="absolute -top-0.5 -right-1 size-2 rounded-full border-[1.5px] border-surface bg-danger-solid"
        />
      )}
    </span>
  );
}
