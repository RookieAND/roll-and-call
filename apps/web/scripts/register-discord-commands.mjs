// 슬래시 커맨드를 테스트 길드에 등록한다.
//   node --env-file=.env.local scripts/register-discord-commands.mjs
// ponytail: 길드 전용 등록이라 즉시 반영된다. 전역 등록이 필요해지면 경로만 바꾸면 된다.
const CHAT_INPUT = 1;
const STRING_OPTION = 3;

const COMMANDS = [
  {
    name: "능력치",
    type: CHAT_INPUT,
    description: "크툴루 7판 능력치를 세 줄 굴린다",
  },
  {
    name: "주사위",
    type: CHAT_INPUT,
    description: "1d10, 3d6+2 같은 식으로 주사위를 굴린다",
    options: [{ name: "식", type: STRING_OPTION, description: "예: 1d10, 3d6+2", required: true }],
  },
];

const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;
if (!token || !guildId) throw new Error("DISCORD_BOT_TOKEN, DISCORD_GUILD_ID not set");

async function discord(path, method = "GET", body) {
  const response = await fetch(`https://discord.com/api/v10${path}`, {
    method,
    headers: {
      authorization: `Bot ${token}`,
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Discord ${method} ${path} → ${response.status} ${await response.text()}`);
  }
  return await response.json();
}

const application = await discord("/applications/@me");
const registered = await discord(
  `/applications/${application.id}/guilds/${guildId}/commands`,
  "PUT",
  COMMANDS,
);
console.log(`registered: ${registered.map((command) => `/${command.name}`).join(", ")}`);
