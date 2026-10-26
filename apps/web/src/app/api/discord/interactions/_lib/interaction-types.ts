import type { DiscordEmbed } from "@roll-and-call/discord";

export type DiscordInteractionOption = { name: string; value?: string | number | boolean };

export type DiscordInteractionUser = { id: string; username: string; global_name?: string | null };

export type DiscordAttachment = {
  id: string;
  filename: string;
  content_type?: string;
  size: number;
  url: string;
};

export type DiscordModalField = {
  custom_id: string;
  value?: string | boolean;
  values?: string[];
};

export type DiscordSelectOption = { label: string; value: string; default?: boolean };

export type DiscordMessageComponent = {
  custom_id?: string;
  options?: DiscordSelectOption[];
};

export type DiscordInteraction = {
  type: number;
  application_id?: string;
  token?: string;
  guild_id?: string;
  data?: {
    name?: string;
    custom_id?: string;
    values?: string[];
    options?: DiscordInteractionOption[];
    components?: { component: DiscordModalField }[];
    resolved?: { attachments?: Record<string, DiscordAttachment> };
  };
  message?: { components?: { components?: DiscordMessageComponent[] }[] };
  member?: { nick?: string | null; user: DiscordInteractionUser };
  user?: DiscordInteractionUser;
};

export type DiscordInteractionResponse = {
  type: number;
  data?: {
    content?: string;
    flags?: number;
    embeds?: DiscordEmbed[];
    allowed_mentions?: { parse: [] };
    custom_id?: string;
    title?: string;
    components?: unknown[];
  };
};
