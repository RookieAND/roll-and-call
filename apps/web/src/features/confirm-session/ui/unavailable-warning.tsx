import { Text } from "@trpg/ui";
import { TriangleAlert } from "lucide-react";

export function UnavailableWarning({ names }: { names: string[] }) {
  return (
    <div className="flex gap-2 rounded-xl bg-warning-50 px-3.5 py-3">
      <TriangleAlert size={15} className="mt-0.5 shrink-0 text-warning-600" aria-hidden />
      <div className="min-w-0">
        <Text typography="body3" render={<p />} className="font-semibold text-warning-600">
          가능하다고 하지 않은 사람이 {names.length}명 있습니다
        </Text>
        <Text typography="body4" render={<p />} className="mt-0.5 text-warning-600">
          {names.join(", ")}
          <br />
          확정 전에 이 날 진행이 가능한지 물어보세요.
        </Text>
      </div>
    </div>
  );
}
