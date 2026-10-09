import { Badge } from "@roll-and-call/ui";

// ponytail: Badge가 윤곽선 변형을 갖지 않아 시안대로 투명 배경과 테두리, 작은 글자를 className으로 준다.
export function GmBadge() {
  return (
    <Badge className="h-5 border border-(--rc-color-border-normal) bg-transparent px-075 py-0 text-body5 leading-[18px]">
      GM
    </Badge>
  );
}
