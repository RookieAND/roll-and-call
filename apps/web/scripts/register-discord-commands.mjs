//   node --env-file=.env.local scripts/register-discord-commands.mjs
// ponytail: 길드 전용 등록이라 즉시 반영된다. 전역 등록이 필요해지면 경로만 바꾸면 된다.
const CHAT_INPUT = 1;
const STRING_OPTION = 3;
const INTEGER_OPTION = 4;
const PICK_OPTION_COUNT = 10;

const COMMANDS = [
  {
    name: "능력치",
    type: CHAT_INPUT,
    description: "능력치를 굴린다 (크툴루 7판은 세 줄, DnD 5판은 4d6 중 낮은 눈 버리기)",
    options: [
      {
        name: "규칙",
        type: STRING_OPTION,
        description: "기본은 크툴루 7판",
        choices: [
          { name: "크툴루 7판", value: "coc" },
          { name: "DnD 5판", value: "dnd" },
        ],
      },
    ],
  },
  {
    name: "판정",
    type: CHAT_INPUT,
    description: "크툴루 7판 기능·특성치 판정 (1d100)",
    options: [
      {
        name: "목표값",
        type: INTEGER_OPTION,
        description: "기능이나 특성치 값",
        required: true,
        min_value: 1,
        max_value: 99,
      },
      {
        name: "보정",
        type: INTEGER_OPTION,
        description: "양수는 보너스 주사위, 음수는 페널티 주사위 개수",
        min_value: -2,
        max_value: 2,
      },
    ],
  },
  {
    name: "선택",
    type: CHAT_INPUT,
    description: "항목 중 하나를 무작위로 고른다",
    options: Array.from({ length: PICK_OPTION_COUNT }, (_, index) => ({
      name: `항목${index + 1}`,
      type: STRING_OPTION,
      description: `항목 ${index + 1}`,
      required: index < 2,
    })),
  },
  {
    name: "주사위",
    type: CHAT_INPUT,
    description: "1d10, 3d6+2 같은 식으로 주사위를 굴린다",
    options: [{ name: "식", type: STRING_OPTION, description: "예: 1d10, 3d6+2", required: true }],
  },
  {
    name: "온보딩",
    type: CHAT_INPUT,
    description: "튜토리얼 퀘스트로 롤앤콜을 체험한다",
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
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
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
