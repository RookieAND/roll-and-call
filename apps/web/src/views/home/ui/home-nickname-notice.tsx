import { Button, Callout } from "@roll-and-call/ui";

import { directionalParticle } from "@/shared/lib";
import { LineBreaks, ServerLink } from "@/shared/ui";

// 겹쳐서 숫자가 붙은 닉네임을 쓰는 동안 홈 맨 위에 둔다. 닉네임을 저장하면 사라진다.
export function HomeNicknameNotice({ nickname }: { nickname: string }) {
  return (
    <Callout.Root colorPalette="gray" size="sm">
      <Callout.Icon />
      <Callout.Description className="text-pretty break-keep">
        <LineBreaks
          lines={[
            "다른 멤버와 닉네임이 겹쳐",
            `「${nickname}」${directionalParticle(nickname)} 임시 저장했습니다.`,
            "원하는 닉네임으로 바꿔 주세요.",
          ]}
        />
      </Callout.Description>
      <div className="col-start-2 mt-125">
        <Button variant="outline" size="sm" render={<ServerLink path="/me/edit" />}>
          닉네임 바꾸기
        </Button>
      </div>
    </Callout.Root>
  );
}
