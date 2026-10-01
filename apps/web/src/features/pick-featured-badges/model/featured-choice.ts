import type { BadgeLook } from "@roll-and-call/database/badges/model";

export type FeaturedChoice = {
  key: string;
  emoji: string;
  name: string;
  look: BadgeLook;
  tag: string | null;
};
