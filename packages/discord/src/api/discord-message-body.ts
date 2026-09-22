import type { DiscordMessageInput } from "../model/discord-types";

const COMPONENT_TYPE = { actionRow: 1, button: 2 } as const;
const LINK_BUTTON_STYLE = 5;

export function discordMessageBody({
  content,
  embeds,
  buttons,
  userMentions = [],
}: DiscordMessageInput) {
  const buttonRow = {
    type: COMPONENT_TYPE.actionRow,
    components: buttons?.map(({ label, url }) => ({
      type: COMPONENT_TYPE.button,
      style: LINK_BUTTON_STYLE,
      label,
      url,
    })),
  };
  const components = buttons && (buttons.length > 0 ? [buttonRow] : []);
  return { content, embeds, components, allowed_mentions: { parse: [], users: userMentions } };
}
