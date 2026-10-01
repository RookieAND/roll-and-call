import { isNull } from "es-toolkit";

import type { MemberServer } from "../model/member-server";
import { ClosingSection } from "./closing-section";
import { FeaturesSection } from "./features-section";
import { FlowSection } from "./flow-section";
import { IndexFooter } from "./index-footer";
import { IndexHero } from "./index-hero";
import { MyServersSection } from "./my-servers-section";

interface IndexViewProps {
  userId: string | null;
  servers: MemberServer[];
}

// 모바일 틀 밖의 전체 폭 화면이라 본문(main#main)을 스스로 둔다. 너비 기준은 컨테이너(cqw)다.
export function IndexView({ userId, servers }: IndexViewProps) {
  const signedIn = !isNull(userId);
  return (
    <main id="main" className="@container min-h-dvh bg-surface text-gray-900">
      <IndexHero signedIn={signedIn}>
        {signedIn && <MyServersSection servers={servers} userId={userId} />}
      </IndexHero>
      <FeaturesSection />
      <FlowSection />
      <ClosingSection signedIn={signedIn} />
      <IndexFooter />
    </main>
  );
}
