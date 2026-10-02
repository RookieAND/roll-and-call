import { isNull } from "es-toolkit";

import type { MenuServer } from "@/shared/ui";

import { ClosingSection } from "./closing-section";
import { FeaturesSection } from "./features-section";
import { FlowSection } from "./flow-section";
import { IndexFooter } from "./index-footer";
import { IndexHeader } from "./index-header";
import { IndexHero } from "./index-hero";

interface IndexViewProps {
  // null이면 비로그인. 로그인했으면 최근 방문 순 내 서버
  servers: MenuServer[] | null;
  // 가입한 서버가 없을 때 바로 가입할 수 있는 서버
  joinable: MenuServer[];
}

// 모바일 틀 밖의 전체 폭 화면이라 본문(main#main)을 스스로 둔다. 너비 기준은 컨테이너(cqw)다.
export function IndexView({ servers, joinable }: IndexViewProps) {
  return (
    <main id="main" className="@container min-h-dvh bg-surface text-gray-900">
      <IndexHeader servers={servers} joinable={joinable} />
      <IndexHero servers={servers} joinable={joinable} />
      <FeaturesSection />
      <FlowSection />
      <ClosingSection signedIn={!isNull(servers)} />
      <IndexFooter />
    </main>
  );
}
