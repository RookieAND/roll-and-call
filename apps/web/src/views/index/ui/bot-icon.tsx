import { cn } from "@roll-and-call/ui";
import Image from "next/image";

interface BotIconProps {
  size: number;
  className?: string;
}

// 롤앤콜 디스코드 봇의 얼굴. 앱 아이콘(app/icon.png)과 같은 그림이다.
// 프리플라이트가 img 높이를 auto로 두어 flex 줄 높이만큼 늘어나 찌그러지므로 크기를 직접 고정한다.
export function BotIcon({ size, className }: BotIconProps) {
  return (
    <Image
      src="/icon.png"
      alt=""
      width={size}
      height={size}
      unoptimized
      style={{ width: size, height: size }}
      className={cn("aspect-square flex-none rounded-full object-cover", className)}
    />
  );
}
