import { cn } from "@roll-and-call/ui";
import Image from "next/image";

interface BotIconProps {
  size: number;
  className?: string;
}

// 디스코드 알림을 보내는 봇의 얼굴. 앱 아이콘(app/icon.png)과 같은 그림이다.
export function BotIcon({ size, className }: BotIconProps) {
  return (
    <Image
      src="/icon.png"
      alt=""
      width={size}
      height={size}
      unoptimized
      className={cn("flex-none rounded-full", className)}
    />
  );
}
