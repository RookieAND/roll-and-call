export type DiscordEmbedField = { name: string; value: string; inline?: boolean };

export type DiscordEmbed = {
  title?: string;
  url?: string;
  description?: string;
  color?: number;
  fields?: DiscordEmbedField[];
  image?: { url: string };
  footer?: { text: string };
  timestamp?: string;
};

export type DiscordLinkButton = { label: string; url: string };

export type DiscordMessage = { id: string; channel_id: string };

export type DiscordMessageInput = {
  content?: string;
  embeds?: DiscordEmbed[];
  // 링크 버튼만 된다(인터랙션 엔드포인트 없음). 수정 때 빠지면 기존 버튼이 남고, []면 지운다.
  buttons?: DiscordLinkButton[];
  // allowed_mentions allowlist: 멘션은 content에도 있어야 울린다.
  userMentions?: string[];
};
