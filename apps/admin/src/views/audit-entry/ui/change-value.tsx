import { Text } from "@roll-and-call/ui";

interface ChangeValueProps {
  children: string;
  struck?: boolean;
}

// 문구처럼 긴 값도 줄을 바꿔 전부 보인다. 삭제된 값은 흐리게 취소선으로 보인다.
export function ChangeValue({ children, struck = false }: ChangeValueProps) {
  const foreground = struck ? "hint" : "normal";
  const decoration = struck ? "line-through" : "";
  return (
    <Text
      typography="body3"
      foreground={foreground}
      className={`min-w-0 whitespace-pre-wrap break-words ${decoration}`}
    >
      {children}
    </Text>
  );
}
