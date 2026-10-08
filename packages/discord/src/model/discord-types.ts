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

// 누르면 인터랙션 엔드포인트로 customId가 온다.
export type DiscordActionButton = { label: string; customId: string };

export type DiscordButton = DiscordLinkButton | DiscordActionButton;

export type DiscordMessage = { id: string; channel_id: string };

export type DiscordMessageInput = {
  content?: string;
  embeds?: DiscordEmbed[];
  // 수정 때 빠지면 기존 버튼이 남고, []면 지운다.
  buttons?: DiscordButton[];
  // allowed_mentions allowlist: 멘션은 content에도 있어야 울린다.
  userMentions?: string[];
  // 서버 운영진이 머리 줄에 직접 적은 역할 멘션. content에 같은 <@&id>가 있어야 울린다.
  roleMentions?: string[];
};

export type DiscordFile = { name: string; blob: Blob };

export type DiscordForumPostInput = {
  name: string;
  appliedTags: string[];
  content: string;
  files: DiscordFile[];
};
