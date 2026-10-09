import { GRANT_LANTERN_RESULT, grantLanternBadge } from "@roll-and-call/database/badges";

// 버그 제보자에게 히든 칭호 작은 등불(sp.lantern)을 준다. 이미 받았으면 아무것도 하지 않는다.
// 실행: NODE_OPTIONS=--conditions=react-server pnpm dlx tsx --env-file=.env.local scripts/grant-bug-reporter-badge.mts <유저 ID> <서버 이름>
// 유저 ID는 프로필 uuid 또는 디스코드 ID, 서버 이름은 servers.name(또는 slug).
const [userKey, serverKey] = process.argv.slice(2);
if (!userKey || !serverKey) throw new Error("인자: <유저 ID> <서버 이름>");

const { result, username, serverName } = await grantLanternBadge({ userKey, serverKey });
const messages = {
  [GRANT_LANTERN_RESULT.granted]: `🕯️ 작은 등불 지급: ${username} @ ${serverName}`,
  [GRANT_LANTERN_RESULT.alreadyHeld]: `이미 받았습니다: ${username} @ ${serverName}`,
  [GRANT_LANTERN_RESULT.serverNotFound]: `서버를 찾지 못했습니다: ${serverKey}`,
  [GRANT_LANTERN_RESULT.userNotFound]: `유저를 찾지 못했습니다: ${userKey}`,
  [GRANT_LANTERN_RESULT.notMember]: `${username}은(는) ${serverName} 서버 멤버가 아닙니다`,
};
console.log(messages[result]);
process.exit(
  result === GRANT_LANTERN_RESULT.granted || result === GRANT_LANTERN_RESULT.alreadyHeld ? 0 : 1,
);
