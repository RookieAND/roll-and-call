import { Text, VStack } from "@roll-and-call/ui";
import { Lock } from "lucide-react";

import { AdminHeader } from "@/shared/ui";

interface SettingsDeniedViewProps {
  ownerNickname?: string;
}

export function SettingsDeniedView({ ownerNickname }: SettingsDeniedViewProps) {
  const owner = ownerNickname ? `소유자(${ownerNickname})` : "소유자";
  return (
    <>
      <AdminHeader title="설정" />
      <div className="grid flex-1 place-items-center p-200">
        <VStack
          align="center"
          className="w-[400px] rounded-600 border border-gray-200 bg-surface px-300 py-400 text-center"
        >
          <span className="mb-150 grid size-[34px] place-items-center rounded-400 bg-gray-100 text-hint">
            <Lock size={16} aria-hidden />
          </span>
          <Text typography="heading3" render={<h2 />}>
            소유자만 이용할 수 있어요
          </Text>
          <Text typography="body3" foreground="hint" render={<p />} className="mt-075">
            운영진 관리와 서비스 설정은 {owner}가 담당합니다.
          </Text>
        </VStack>
      </div>
    </>
  );
}
