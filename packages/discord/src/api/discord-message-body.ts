import type { DiscordMessageInput } from "../model/discord-types";

const COMPONENT_TYPE = { actionRow: 1, button: 2 } as const;
const BUTTON_STYLE = { primary: 1, link: 5 } as const;

const MESSAGE_FLAG_SUPPRESS_EMBEDS = 1 << 2;

export function discordMessageBody({
  content,
  embeds,
  suppressEmbeds,
  buttons,
  userMentions = [],
  roleMentions = [],
}: DiscordMessageInput) {
  const buttonRow = {
    type: COMPONENT_TYPE.actionRow,
    components: buttons?.map((button) =>
      "url" in button
        ? {
            type: COMPONENT_TYPE.button,
            style: BUTTON_STYLE.link,
            label: button.label,
            url: button.url,
          }
        : {
            type: COMPONENT_TYPE.button,
            style: BUTTON_STYLE.primary,
            label: button.label,
            custom_id: button.customId,
          },
    ),
  };
  const components = buttons && (buttons.length > 0 ? [buttonRow] : []);
  return {
    content,
    embeds,
    components,
    flags: suppressEmbeds ? MESSAGE_FLAG_SUPPRESS_EMBEDS : undefined,
    allowed_mentions: { parse: [], users: userMentions, roles: roleMentions },
  };
}
