export const INTERACTION_RESPONSE_TYPE = { message: 4, updateMessage: 7 } as const;

export type InteractionResponseType =
  (typeof INTERACTION_RESPONSE_TYPE)[keyof typeof INTERACTION_RESPONSE_TYPE];
