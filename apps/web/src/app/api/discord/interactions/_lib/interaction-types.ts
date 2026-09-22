import type { DiscordEmbed } from "@roll-and-call/discord";

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
  data?: {
    content?: string;
    embeds?: DiscordEmbed[];
    allowed_mentions: { parse: [] };
  };
};
