import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { EntryBackdrop } from "./entry-backdrop";
import { ServerEmblem, type EmblemMark } from "./server-emblem";

interface ServerStageProps {
  name: string;
  icon: string | null;
  mark?: EmblemMark;
  dimmed?: boolean;
  header?: ReactNode;
  // 엠블럼 아래 글.
  children: ReactNode;
  // 아래에서 올라오는 시트.
  sheet: ReactNode;
}

// 가입·가입 완료 화면의 틀: 위는 서버, 아래 시트는 상태와 할 일. 상태가 바뀌어도 위쪽은 그대로 둔다.
export function ServerStage({
  name,
  icon,
  mark,
  dimmed,
  header,
  children,
  sheet,
}: ServerStageProps) {
  return (
    <VStack
      className="relative min-h-dvh overflow-hidden"
      style={{ backgroundImage: "var(--gradient-onboarding)" }}
    >
      <EntryBackdrop />
      {header}
      <VStack align="center" justify="center" gap="225" className="relative flex-1 px-300 pb-700">
        <ServerEmblem name={name} icon={icon} mark={mark} dimmed={dimmed} />
        {children}
      </VStack>
      {sheet}
    </VStack>
  );
}
