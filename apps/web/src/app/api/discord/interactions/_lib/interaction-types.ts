import type { DiscordEmbed } from "@roll-and-call/discord";

export type DiscordInteractionOption = { name: string; value?: string | number | boolean };

export type DiscordInteractionUser = { id: string; username: string; global_name?: string | null };

export type DiscordInteraction = {
  type: number;
  guild_id?: string;
  data?: { name: string; custom_id?: string; options?: DiscordInteractionOption[] };
  member?: { nick?: string | null; user: DiscordInteractionUser };
  user?: DiscordInteractionUser;
};

export type DiscordInteractionResponse = {
  type: number;
  data?: {
    content?: string;
    flags?: number;
    embeds?: DiscordEmbed[];
    allowed_mentions: { parse: [] };
  };
};
