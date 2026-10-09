import { Badge, Callout } from "@roll-and-call/ui";

interface EnforcementBannerProps {
  title: string;
  dday: string;
}

export function EnforcementBanner({ title, dday }: EnforcementBannerProps) {
  return (
    <Callout.Root colorPalette="notice">
      <Callout.Icon />
      <Callout.Title className="break-keep">{title}</Callout.Title>
      <Callout.Description className="break-keep text-pretty">
        인증이 필요한 룰은 별도의 룰북 인증이 필요합니다.
      </Callout.Description>
      <Badge colorPalette="warning" className="flex-none self-start">
        {dday}
      </Badge>
    </Callout.Root>
  );
}
