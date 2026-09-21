import type { LucideIcon } from "lucide-react";

interface NavIconProps {
  Icon: LucideIcon;
  dot?: boolean;
}

export function NavIcon({ Icon, dot = false }: NavIconProps) {
  return (
    <span className="relative flex">
      <Icon size={18} aria-hidden />
      {dot && (
        <span
          role="img"
          aria-label="할 일 있음"
          className="absolute -top-0.5 -right-1 size-2 rounded-full border-[1.5px] border-surface bg-danger-solid"
        />
      )}
    </span>
  );
}
