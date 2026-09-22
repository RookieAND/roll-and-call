import { Text, toast, Toast, VStack } from "@roll-and-call/ui";
import { useEffect } from "react";

// 토스트는 화면 바닥에 붙는다. 카드 안에서는 이 상자가 화면 역할을 한다.
const Screen = ({ children }: { children: React.ReactNode }) => (
  <VStack gap="100" className="h-[360px] w-full bg-canvas px-200 pt-200">
    {children}
  </VStack>
);

export const SessionConfirmed = () => {
  useEffect(() => {
    toast.success("세션을 확정했습니다", { duration: 100000 });
  }, []);
  return (
    <Screen>
      <Text typography="subtitle1">참여자 관리</Text>
      <Text typography="body4" foreground="muted">
        확정 4명 · 대기 2명
      </Text>
      <Toast.Viewport />
    </Screen>
  );
};

export const DeleteFailed = () => {
  useEffect(() => {
    toast.danger("구인 삭제에 실패했습니다", { duration: 100000 });
  }, []);
  return (
    <Screen>
      <Text typography="subtitle1">구인 관리</Text>
      <Text typography="body4" foreground="muted">
        잠시 후 다시 시도해 주세요.
      </Text>
      <Toast.Viewport />
    </Screen>
  );
};

export const UndoAttendance = () => {
  useEffect(() => {
    toast.success("출석을 확정했습니다", {
      duration: 100000,
      action: { label: "되돌리기", onClick: () => {} },
    });
  }, []);
  return (
    <Screen>
      <Text typography="subtitle1">출석 확인</Text>
      <Text typography="body4" foreground="muted">
        참석 5명 · 불참 1명
      </Text>
      <Toast.Viewport />
    </Screen>
  );
};
