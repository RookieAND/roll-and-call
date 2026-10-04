import { Callout } from "@roll-and-call/ui";

import { objectParticle } from "@/shared/lib";
import { LineBreaks } from "@/shared/ui";

interface WelcomeSuffixNoticeProps {
  suffixBase: string;
  rejoined: boolean;
}

// 겹쳐서 숫자를 붙인 닉네임을 받았을 때 칸 위에 둔다. 재가입이면 이전 닉네임이 겹친 것이다.
export function WelcomeSuffixNotice({ suffixBase, rejoined }: WelcomeSuffixNoticeProps) {
  return (
    <Callout.Root colorPalette="gray" size="sm">
      <Callout.Icon />
      <Callout.Description className="text-pretty break-keep">
        <LineBreaks
          lines={[
            `${rejoined ? "이전 닉네임" : "디스코드 닉네임"} 「${suffixBase}」${objectParticle(suffixBase)}`,
            "이미 다른 멤버가 쓰고 있어 숫자를 붙였습니다.",
            "원하는 닉네임으로 바꿀 수 있습니다.",
          ]}
        />
      </Callout.Description>
    </Callout.Root>
  );
}
