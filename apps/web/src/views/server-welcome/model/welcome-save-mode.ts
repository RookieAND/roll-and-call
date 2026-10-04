export const WELCOME_SAVE_MODE = { start: "start", later: "later" } as const;

export type WelcomeSaveMode = (typeof WELCOME_SAVE_MODE)[keyof typeof WELCOME_SAVE_MODE];
