import { createContext } from "react";

export const RADIO_CARD_INDICATOR = { radio: "radio", check: "check", none: "none" } as const;

export type RadioCardIndicator = (typeof RADIO_CARD_INDICATOR)[keyof typeof RADIO_CARD_INDICATOR];

export const RadioCardContext = createContext<RadioCardIndicator>(RADIO_CARD_INDICATOR.radio);
