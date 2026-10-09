import { Badge } from "@roll-and-call/ui";

// ponytail: Badge에 윤곽선 변형이 없어 className으로 GM 색 테두리 알약을 만든다.
export function GmBadge() {
  return (
    <Badge className="border border-gm bg-transparent px-100 py-050 font-extrabold text-gm">
      GM
    </Badge>
  );
}
