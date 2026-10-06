import { RECRUIT_TAG_NAME } from "./resolve-recruit-tags";

const STATUS_EMOJI = { [RECRUIT_TAG_NAME.open]: "🟢", [RECRUIT_TAG_NAME.closed]: "🔴" } as const;

// 룰 이름에 들어 있는 낱말로 고른다. 어디에도 안 맞으면 기본 주사위.
const RULE_EMOJI: [keyword: string, emoji: string][] = [
  ["크툴루", "🐙"],
  ["call of cthulhu", "🐙"],
  ["D&D", "🐉"],
  ["던전", "🗡️"],
  ["피아스코", "🥂"],
  ["머더", "🔪"],
  ["퀼", "🪶"],
  ["마기카", "🔮"],
  ["좀비", "🧟"],
  ["너냐", "🦸"],
  ["여왕", "👑"],
  ["수사", "🕵️"],
  ["셜록", "🔍"],
  ["인세인", "🌀"],
  ["더블크로스", "⚡"],
  ["스텔라", "⚔️"],
  ["나이트버터플라이", "🦋"],
  ["아곤", "🎭"],
  ["스프롤", "🏙️"],
  ["다이얼렉트", "🗣️"],
  ["설화", "📜"],
];
const DEFAULT_RULE_EMOJI = "🎲";

export function recruitTagEmojis(ruleNames: string[]): Record<string, string> {
  const rules = Object.fromEntries(
    ruleNames.map((name) => [
      name.slice(0, 20),
      RULE_EMOJI.find(([keyword]) => name.toLowerCase().includes(keyword.toLowerCase()))?.[1] ??
        DEFAULT_RULE_EMOJI,
    ]),
  );
  return { ...STATUS_EMOJI, ...rules };
}
