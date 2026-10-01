import type { BadgeLook } from "@roll-and-call/database/rules";

export type FeaturedChoice = {
  key: string;
  emoji: string;
  name: string;
  look: BadgeLook;
  tag: string | null;
};
