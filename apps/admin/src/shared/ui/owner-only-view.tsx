import { Text, VStack } from "@roll-and-call/ui";
import { Lock } from "lucide-react";

import { AdminHeader } from "@/shared/ui";

interface OwnerOnlyViewProps {
  title: string;
  scope: string;
  ownerNickname?: string;
}

export function OwnerOnlyView({ title, scope, ownerNickname }: OwnerOnlyViewProps) {
  const owner = ownerNickname ? `소유자(${ownerNickname})가` : "소유자가";
  return (
    <>
      <AdminHeader title={title} />
      <div className="grid flex-1 place-items-center p-200">
        <VStack
          align="center"
          className="w-[400px] rounded-800 border border-gray-200 bg-surface px-300 py-400 text-center"
        >
          <span className="mb-150 grid size-8.5 place-items-center rounded-400 bg-gray-100 text-hint">
            <Lock size={18} aria-hidden />
          </span>
          <Text typography="heading3" render={<h2 />}>
            소유자만 이용할 수 있습니다
          </Text>
          <Text typography="body3" foreground="hint" render={<p />} className="mt-075">
            {scope}은 {owner} 담당합니다.
          </Text>
        </VStack>
      </div>
    </>
  );
}
