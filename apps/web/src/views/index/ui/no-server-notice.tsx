import { Callout } from "@roll-and-call/ui";
import { Link2 } from "lucide-react";

export function NoServerNotice() {
  return (
    <Callout.Root>
      <Callout.Icon className="text-tinted-ink">
        <Link2 size={16} strokeWidth={2.2} />
      </Callout.Icon>
      <Callout.Description className="font-semibold break-keep">
        서버 운영진이 공유한
        <br />
        Roll &amp; Call 주소로 들어와 주세요
      </Callout.Description>
    </Callout.Root>
  );
}
