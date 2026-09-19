export type DiscordInteractionOption = { name: string; value?: string | number | boolean };

export type DiscordInteractionUser = { username: string; global_name?: string | null };

export type DiscordInteraction = {
  type: number;
  data?: { name: string; options?: DiscordInteractionOption[] };
  member?: { nick?: string | null; user: DiscordInteractionUser };
  user?: DiscordInteractionUser;
};

export type DiscordInteractionResponse = {
  type: number;
  data?: { content: string; allowed_mentions: { parse: [] } };
};
