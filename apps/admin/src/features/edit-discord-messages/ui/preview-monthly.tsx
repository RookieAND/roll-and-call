import { DISCORD } from "@/shared/lib";

// 이달의 GM·PL은 임베드 없이 머리 줄 아래에 평문 본문이 붙는다. 이름은 프로필 링크다.
export function PreviewMonthly() {
  return (
    <div className="leading-[22px]">
      <b className="text-white">9월 이달의 GM·PL</b>
      <div>
        🎖️ 이달의 GM: <span style={{ color: DISCORD.link }}>새벽세시</span> · 세션 5회 진행
      </div>
      <div>
        🏅 이달의 PL: <span style={{ color: DISCORD.link }}>탐정놀이중</span> · 세션 8회 참여
      </div>
    </div>
  );
}
