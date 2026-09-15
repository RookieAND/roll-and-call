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

export type DiscordMessage = { id: string; channel_id: string };

export type DiscordMessageInput = {
  content?: string;
  embeds?: DiscordEmbed[];
  // allowed_mentions allowlist: 멘션은 content에도 있어야 울린다.
  userMentions?: string[];
};
