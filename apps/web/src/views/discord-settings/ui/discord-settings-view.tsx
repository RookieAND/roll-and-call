import { Container, Text } from "@trpg/ui";
import type { ReactNode } from "react";
import { LoginRequired } from "@/features/auth";
import { DiscordAutoOpenSwitch } from "@/features/discord-auto-open";
import { getCurrentUser, getProfile, isDiscordConfigured } from "@/shared/server";
import { AppBar } from "@/shared/ui";

const GROUP = "overflow-hidden rounded-[14px] border border-gray-200";
const ROW = "flex min-h-14 items-center gap-3 border-b border-gray-100 px-3.5 py-3 last:border-b-0";

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={ROW}>
      <Text typography="subtitle2" className="w-[88px] shrink-0">
        {label}
      </Text>
      <Text typography="body4" foreground="muted" render={<p />} className="min-w-0 flex-1">
        {value}
      </Text>
    </div>
  );
}

// 디스코드 연동 설정: "어느 서버에, 언제 채널을 만들지"는 GM이 한 번 정하면 모든 구인에 적용된다.
// 구인 쪽(참여자 관리)에는 그 세션 채널의 상태 한 줄만 남는다.
// ponytail: 서버·카테고리·공지 채널은 환경 변수로 고정된 한 서버다. GM별로 고르게 할 일이 생기면 그때 설정 칸을 늘린다.
export async function DiscordSettingsView() {
  const user = await getCurrentUser();
  const appBar = <AppBar back="/me" title="디스코드 연동" />;
  if (!user) {
    return (
      <>
        {appBar}
        <Container size="sm">
          <div className="py-6">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const profile = await getProfile(user.id);
  const configured = isDiscordConfigured();

  return (
    <>
      {appBar}
      <Container size="sm">
        <div className="flex flex-col gap-5 py-5">
          <section className={GROUP}>
            <div className={ROW}>
              <div className="min-w-0 flex-1">
                <Text typography="subtitle2" className="block">
                  {configured ? "롤앤콜 서버에 연결됨" : "디스코드가 연동되지 않았습니다"}
                </Text>
                <Text typography="body4" foreground="hint" className="block">
                  {configured
                    ? "봇 권한: 채널 관리 · 메시지 보내기"
                    : "채널·공지·알림이 모두 꺼져 있습니다. 운영자에게 봇 설정을 요청하세요."}
                </Text>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <Text typography="body3" foreground="muted" render={<h2 />} className="font-bold">
              세션 채널
            </Text>
            <div className={GROUP}>
              <div className={ROW}>
                <div className="min-w-0 flex-1">
                  <Text typography="subtitle2" render={<label htmlFor="discordAutoOpen" />} className="block">
                    확정되면 자동 개설
                  </Text>
                  <Text typography="body4" foreground="hint" render={<p />} id="discordAutoOpen-hint">
                    세션 시간을 확정하는 순간 비공개 채널을 만듭니다. 끄면 참여자 관리에서 직접 엽니다.
                  </Text>
                </div>
                <DiscordAutoOpenSwitch
                  defaultEnabled={profile?.discordAutoOpen ?? false}
                  disabled={!configured}
                />
              </div>
              <InfoRow label="만들 위치" value={'롤앤콜 서버 › "세션 N · 제목" 카테고리를 자동 생성'} />
              <InfoRow label="채널 구성" value="GM-CHAT · PLAYER-CHAT · INFO · GM-VOICE · PLAYER-VOICE" />
              <InfoRow label="뒤에 확정되는 사람" value="채널을 연 뒤에 확정된 참여자도 자동으로 합류시킵니다." />
              <InfoRow label="세션이 끝나면" value="보관 처리하고 참여자 접근을 닫습니다." />
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <Text typography="body3" foreground="muted" render={<h2 />} className="font-bold">
              공지와 알림
            </Text>
            <div className={GROUP}>
              <InfoRow label="모집 공지" value="모집 공지 채널에 올리고, 참여·대기·이탈은 공지 스레드에 남깁니다." />
              <InfoRow label="시작 전 알림" value="세션 1시간 전에 확정 참여자를 멘션합니다." />
            </div>
          </section>

          <Text typography="body4" foreground="hint" render={<p />}>
            여기서 정한 값은 앞으로 올리는 모든 구인에 적용됩니다. 구인 하나만 다르게 하려면 참여자 관리에서 그
            구인의 채널을 끄면 됩니다.
          </Text>
        </div>
      </Container>
    </>
  );
}
