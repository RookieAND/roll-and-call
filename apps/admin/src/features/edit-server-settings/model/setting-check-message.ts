import { SETTING_FAIL_REASON, SETTING_TARGET_KIND, type SettingCheck } from "./setting-check";

export const CHECKING_MESSAGE = "봇이 채널과 권한을 확인하고 있습니다";

// 통과·실패 문구는 시안 s11.jsx를 따른다. 시안에 없는 실패(wrongType·roleNotInServer·cannotManageRoles·unreachable)는 임시 문구다.
export function settingCheckMessage({
  check,
  serverName,
}: {
  check: SettingCheck;
  serverName: string;
}) {
  if (check.status === "ok") {
    if (check.kind === SETTING_TARGET_KIND.role) return `@${check.name} 역할을 확인했습니다`;
    if (check.kind === SETTING_TARGET_KIND.forum) return `#${check.name} 포럼 채널을 확인했습니다`;
    return `#${check.name} 채널을 확인했습니다`;
  }
  switch (check.reason) {
    case SETTING_FAIL_REASON.notInServer:
      return `이 서버의 채널이 아닙니다. ${serverName} 서버에 있는 채널의 ID를 넣어 주세요.`;
    case SETTING_FAIL_REASON.cannotPost:
      return "봇이 이 채널에 글을 쓸 수 없습니다. 채널 권한에서 Roll & Call 봇에 메시지 보내기를 허용해 주세요.";
    case SETTING_FAIL_REASON.roleAboveBot:
      return "GM 역할이 봇 역할보다 위에 있어 부여할 수 없습니다. 디스코드 역할 목록에서 봇 역할을 GM 위로 옮겨 주세요.";
    case SETTING_FAIL_REASON.wrongType:
      return "이 항목에 쓸 수 없는 종류의 채널입니다. 다른 채널의 ID를 넣어 주세요.";
    case SETTING_FAIL_REASON.roleNotInServer:
      return `이 서버의 역할이 아닙니다. ${serverName} 서버에 있는 역할의 ID를 넣어 주세요.`;
    case SETTING_FAIL_REASON.cannotManageRoles:
      return "봇에게 역할 관리 권한이 없어 GM 역할을 부여할 수 없습니다. 봇 역할에 역할 관리를 허용해 주세요.";
    case SETTING_FAIL_REASON.unreachable:
      return "봇이 디스코드 서버 정보를 읽지 못했습니다. 잠시 뒤에 다시 확인해 주세요.";
  }
}
