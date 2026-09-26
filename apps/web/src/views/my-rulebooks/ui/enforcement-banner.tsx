import { Badge, Callout } from "@roll-and-call/ui";

interface EnforcementBannerProps {
  text: string;
  dday: string;
}

// 적용일 전 안내. 적용일이 지나거나 없으면 그리지 않는다.
export function EnforcementBanner({ text, dday }: EnforcementBannerProps) {
  return (
    <Callout.Root colorPalette="notice">
      <Callout.Icon />
      <Callout.Description className="font-semibold break-keep [text-wrap:pretty]">
        {text}
      </Callout.Description>
      <Badge colorPalette="warning" className="flex-none self-start">
        {dday}
      </Badge>
    </Callout.Root>
  );
}
