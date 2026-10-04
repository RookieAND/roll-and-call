import { SETTING_FAIL_REASON, SETTING_TARGET_KIND, type SettingCheck } from "./setting-check";

export const CHECKING_MESSAGE = "봇이 채널과 권한을 확인하고 있습니다";
export const BOT_DISCONNECTED_MESSAGE = "봇 연결이 끊겨 확인할 수 없습니다";

// 실패 문구는 두 줄이다: 굵게 무엇이 문제인지, 보통 글씨로 어떻게 고치는지.
export function settingCheckMessage({
  check,
  serverName,
}: {
  check: SettingCheck;
  serverName: string;
}): { title: string; description?: string } {
  if (check.status === "ok") {
    if (check.kind === SETTING_TARGET_KIND.forum) {
      return { title: `#${check.name} 포럼 채널을 확인했습니다` };
    }
    return { title: `#${check.name} 채널을 확인했습니다` };
  }
  switch (check.reason) {
    case SETTING_FAIL_REASON.notInServer:
      return {
        title: "이 서버의 채널이 아닙니다.",
        description: `${serverName} 서버에 있는 채널의 ID를 넣어 주세요.`,
      };
    case SETTING_FAIL_REASON.cannotPost:
      return {
        title: "봇이 이 채널에 글을 쓸 수 없습니다.",
        description: "채널 권한에서 Roll & Call 봇에 메시지 보내기를 허용해 주세요.",
      };
    case SETTING_FAIL_REASON.wrongType:
      return {
        title: "이 항목에 쓸 수 없는 종류의 채널입니다.",
        description: "포럼 칸에는 포럼 채널을, 나머지 칸에는 텍스트 채널을 넣어 주세요.",
      };
    case SETTING_FAIL_REASON.unreachable:
      return {
        title: "봇이 디스코드 서버 정보를 읽지 못했습니다.",
        description: "봇이 서버에 들어 있는지 확인하고 다시 시도해 주세요.",
      };
  }
}
