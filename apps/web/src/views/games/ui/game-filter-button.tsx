import { Badge, cn, IconButton, type IconButtonProps } from "@roll-and-call/ui";
import { ListFilter } from "lucide-react";

interface GameFilterButtonProps extends IconButtonProps {
  count: number;
}

// 숫자는 읽기용 이름에 들어 있어 배지는 화면에만 보인다.
export function GameFilterButton({ count, className, ...props }: GameFilterButtonProps) {
  const label = count > 0 ? `필터, ${count}개 적용` : "필터";
  return (
    <IconButton {...props} aria-label={label} className={cn("relative h-11 w-11", className)}>
      <ListFilter size={20} aria-hidden />
      {count > 0 && (
        <Badge
          colorPalette="primary"
          aria-hidden
          className="absolute top-0 right-0 h-[18px] min-w-[18px] justify-center rounded-full bg-primary-600 px-050 py-0 font-extrabold text-on-primary tabular-nums"
        >
          {count}
        </Badge>
      )}
    </IconButton>
  );
}
