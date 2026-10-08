import type { ComponentType } from "react";

// lucide 아이콘과 직접 만든 로고(DiscordIcon)를 같은 자리에 쓰려는 공통 모양.
export type IconComponent = ComponentType<{ size?: number }>;
